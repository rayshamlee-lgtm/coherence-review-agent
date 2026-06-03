#!/usr/bin/env python3
"""
Coherence Review Agent — local dev server.

Serves the static files in this folder AND acts as a thin CORS-stripping
proxy to Azure OpenAI so the browser can call it without hitting CORS.

Run:
    python3 serve.py            # http://localhost:8000
    python3 serve.py 9000       # custom port

Browser → http://localhost:8000/azure/chat/completions?api-version=...
       → proxy adds api-key and forwards to
         {endpoint}/openai/deployments/{deployment}/chat/completions?...

The browser passes endpoint, deployment, and api-key via custom headers
(X-Azure-Endpoint, X-Azure-Deployment, X-Azure-Key). Nothing is stored on
the server side.
"""

import base64
import http.server
import json
import os
import socketserver
import ssl
import sys
import threading
import time
import urllib.parse
import urllib.request
from pathlib import Path

# macOS python.org builds often have no CA bundle wired up, so urlopen
# raises CERTIFICATE_VERIFY_FAILED against Azure. Demo only talks to the
# user's own *.azure.com endpoint, so we skip verification here. If you
# host this anywhere shared, fix by `pip install certifi` and pass
# `ssl.create_default_context(cafile=certifi.where())` instead.
SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

# Render / Railway / Fly all provide $PORT. Local dev keeps 8000.
PORT = int(os.environ.get("PORT") or (sys.argv[1] if len(sys.argv) > 1 else 8000))
HOST = os.environ.get("HOST", "127.0.0.1" if "PORT" not in os.environ else "0.0.0.0")
ROOT = Path(__file__).parent.resolve()

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
        "Content-Type, X-Azure-Endpoint, X-Azure-Deployment, X-Azure-Key, X-Copilot-Token",
    "Access-Control-Max-Age": "86400",
}

# ---- Copilot proxy state ----
# VS Code's public OAuth client id for Copilot. Used to initiate device
# flow on behalf of the visitor (each user authorizes their own GitHub
# account; their ghu_... token then lives in their browser's
# localStorage and is sent as X-Copilot-Token on every chat request).
COPILOT_CLIENT_ID = "Iv1.b507a08c87ecfe98"
# Headers that make us look like the VS Code Copilot extension. The
# /copilot_internal/* endpoints 404 without these.
COPILOT_EDITOR_HEADERS = {
    "Editor-Version": "vscode/1.95.0",
    "Editor-Plugin-Version": "copilot/1.243.0",
    "User-Agent": "GithubCopilot/1.243.0",
}
# Cache proxy tokens (~25 min lifetime) bucketed per GH user token so
# multiple visitors don't share a single cache slot. Bounded; LRU
# eviction is good enough for the demo scale.
_copilot_lock = threading.Lock()
_copilot_proxy_cache = {}  # gh_token -> (proxy_token, expires_at)
_COPILOT_CACHE_MAX = 256


def _copilot_get_proxy_token(gh_token):
    if not gh_token:
        raise RuntimeError("Missing X-Copilot-Token header. Sign in via Settings.")
    with _copilot_lock:
        now = int(time.time())
        cached = _copilot_proxy_cache.get(gh_token)
        if cached and cached[1] - now > 60:
            return cached[0]
        # Refresh.
        req = urllib.request.Request(
            "https://api.github.com/copilot_internal/v2/token",
            headers={
                "Authorization": f"token {gh_token}",
                "Accept": "application/json",
                **COPILOT_EDITOR_HEADERS,
            },
        )
        with urllib.request.urlopen(req, timeout=30, context=SSL_CTX) as r:
            data = json.load(r)
        tok = data["token"]
        exp = int(data.get("expires_at", time.time() + 1500))
        # Trim cache if it has grown unbounded.
        if len(_copilot_proxy_cache) >= _COPILOT_CACHE_MAX:
            _copilot_proxy_cache.clear()
        _copilot_proxy_cache[gh_token] = (tok, exp)
        return tok


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kw):
        super().__init__(*args, directory=str(ROOT), **kw)

    # ---- CORS preflight for proxy ----
    def do_OPTIONS(self):
        self.send_response(204)
        for k, v in CORS_HEADERS.items():
            self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        # Tiny helper used by the Copilot path: the Copilot proxy refuses
        # external image URLs, only data URLs work. We download the
        # Figma-rendered PNG server-side and hand back base64 so the
        # browser can inline it in the chat-completions payload.
        if self.path.startswith("/image-to-data"):
            return self._image_to_data()
        # GET /copilot/<rest> — used for /copilot/models and any other
        # read-only Copilot endpoints. Login routes are POST-only.
        if self.path.startswith("/copilot/") and not self.path.startswith("/copilot/login/"):
            return self._proxy_copilot()
        return super().do_GET()

    def do_POST(self):
        if self.path.startswith("/azure/"):
            return self._proxy_azure()
        if self.path == "/copilot/login/start":
            return self._copilot_login_start()
        if self.path == "/copilot/login/poll":
            return self._copilot_login_poll()
        if self.path.startswith("/copilot/"):
            return self._proxy_copilot()
        self.send_error(404, "Not Found")

    # ---- Copilot device-flow login ----
    def _copilot_login_start(self):
        try:
            req = urllib.request.Request(
                "https://github.com/login/device/code",
                data=json.dumps({
                    "client_id": COPILOT_CLIENT_ID,
                    "scope": "read:user",
                }).encode(),
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    **COPILOT_EDITOR_HEADERS,
                },
            )
            with urllib.request.urlopen(req, timeout=30, context=SSL_CTX) as r:
                body = r.read()
                status = r.status
        except urllib.error.HTTPError as e:
            body, status = e.read(), e.code
        except Exception as e:
            return self._json_error(502, f"device-code request failed: {e}")
        self._respond_json(status, body)

    def _copilot_login_poll(self):
        length = int(self.headers.get("Content-Length", 0))
        try:
            payload = json.loads(self.rfile.read(length) or b"{}")
        except Exception:
            return self._json_error(400, "invalid JSON body")
        device_code = payload.get("device_code", "")
        if not device_code:
            return self._json_error(400, "missing device_code")
        try:
            req = urllib.request.Request(
                "https://github.com/login/oauth/access_token",
                data=json.dumps({
                    "client_id": COPILOT_CLIENT_ID,
                    "device_code": device_code,
                    "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
                }).encode(),
                headers={
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    **COPILOT_EDITOR_HEADERS,
                },
            )
            with urllib.request.urlopen(req, timeout=30, context=SSL_CTX) as r:
                body = r.read()
                status = r.status
        except urllib.error.HTTPError as e:
            body, status = e.read(), e.code
        except Exception as e:
            return self._json_error(502, f"poll failed: {e}")
        # GitHub returns 200 with {"error": "authorization_pending"} while
        # the user hasn't approved yet. Pass through verbatim.
        self._respond_json(status, body)

    def _respond_json(self, status, body):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        for k, v in CORS_HEADERS.items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    # ---- image fetch + base64 ----
    def _image_to_data(self):
        qs = urllib.parse.urlparse(self.path).query
        params = urllib.parse.parse_qs(qs)
        url = (params.get("url") or [""])[0]
        if not url:
            return self._json_error(400, "missing url parameter")
        try:
            with urllib.request.urlopen(url, timeout=30, context=SSL_CTX) as r:
                data = r.read()
                ctype = r.headers.get("Content-Type", "image/png")
        except Exception as e:
            return self._json_error(502, f"image fetch failed: {e}")
        b64 = base64.b64encode(data).decode("ascii")
        body = json.dumps({"dataUrl": f"data:{ctype};base64,{b64}"}).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        for k, v in CORS_HEADERS.items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    # ---- Copilot proxy ----
    def _proxy_copilot(self):
        # /copilot/<rest>  →  https://api.githubcopilot.com/<rest>
        # Supports both POST (chat/completions, embeddings) and GET
        # (models list, etc.). Method is forwarded verbatim.
        rest = self.path[len("/copilot/"):]
        target = f"https://api.githubcopilot.com/{rest}"

        gh_token = self.headers.get("X-Copilot-Token", "").strip()
        try:
            tok = _copilot_get_proxy_token(gh_token)
        except Exception as e:
            return self._json_error(401, f"Copilot auth failed: {e}")

        method = self.command  # "GET" or "POST"
        body = None
        if method == "POST":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length) if length else b""

        req_headers = {
            "Authorization": f"Bearer {tok}",
            "Accept": "application/json",
            "Copilot-Integration-Id": "vscode-chat",
            **COPILOT_EDITOR_HEADERS,
        }
        if method == "POST":
            req_headers["Content-Type"] = self.headers.get("Content-Type", "application/json")
        req = urllib.request.Request(target, data=body, method=method, headers=req_headers)
        try:
            with urllib.request.urlopen(req, timeout=120, context=SSL_CTX) as resp:
                data = resp.read()
                self.send_response(resp.status)
                self.send_header(
                    "Content-Type",
                    resp.headers.get("Content-Type", "application/json"),
                )
                for k, v in CORS_HEADERS.items():
                    self.send_header(k, v)
                self.end_headers()
                self.wfile.write(data)
        except urllib.error.HTTPError as e:
            err_body = e.read()
            self.send_response(e.code)
            self.send_header("Content-Type", "application/json")
            for k, v in CORS_HEADERS.items():
                self.send_header(k, v)
            self.end_headers()
            self.wfile.write(err_body)
        except Exception as e:
            self._json_error(502, f"Proxy error: {e}")

    # ---- proxy ----
    def _proxy_azure(self):
        endpoint   = self.headers.get("X-Azure-Endpoint", "").rstrip("/")
        deployment = self.headers.get("X-Azure-Deployment", "")
        key        = self.headers.get("X-Azure-Key", "")
        if not (endpoint and deployment and key):
            return self._json_error(400, "Missing X-Azure-Endpoint / -Deployment / -Key headers.")

        # remap /azure/<rest> → /openai/deployments/<deployment>/<rest>
        rest = self.path[len("/azure/"):]
        # rest already may include ?api-version=...
        target = f"{endpoint}/openai/deployments/{urllib.parse.quote(deployment)}/{rest}"

        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length) if length else b""

        req = urllib.request.Request(
            target, data=body, method="POST",
            headers={
                "Content-Type": self.headers.get("Content-Type", "application/json"),
                "api-key": key,
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=120, context=SSL_CTX) as resp:
                data = resp.read()
                self.send_response(resp.status)
                self.send_header("Content-Type", resp.headers.get("Content-Type", "application/json"))
                for k, v in CORS_HEADERS.items():
                    self.send_header(k, v)
                self.end_headers()
                self.wfile.write(data)
        except urllib.error.HTTPError as e:
            err_body = e.read()
            self.send_response(e.code)
            self.send_header("Content-Type", "application/json")
            for k, v in CORS_HEADERS.items():
                self.send_header(k, v)
            self.end_headers()
            self.wfile.write(err_body)
        except Exception as e:
            self._json_error(502, f"Proxy error: {e}")

    def _json_error(self, code, msg):
        body = json.dumps({"error": msg}).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        for k, v in CORS_HEADERS.items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(body)

    # quieter logs
    def log_message(self, fmt, *args):
        sys.stderr.write(f"[{self.log_date_time_string()}] {fmt % args}\n")


class ReusableTCP(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


if __name__ == "__main__":
    with ReusableTCP((HOST, PORT), Handler) as httpd:
        print(f"Coherence Review Agent demo")
        print(f"  → listening on http://{HOST}:{PORT}")
        print(f"  → proxy at /azure/*   (forwards to Azure OpenAI)")
        print(f"  → proxy at /copilot/* (forwards to api.githubcopilot.com)")
        print(f"  → device-flow login at /copilot/login/{{start,poll}}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nbye.")
