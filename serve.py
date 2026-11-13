#!/usr/bin/env python3
"""
Bing Coherence Review Buddy — local dev server.

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

# Verify upstream TLS on hosted deployments. For a local Python installation
# without a CA bundle, configure SSL_CERT_FILE rather than disabling checks.
SSL_CTX = ssl.create_default_context()

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
# Large, high-reasoning 41-metric reviews may legitimately exceed two
# minutes before a non-streaming response is available. Keep a finite,
# configurable upstream timeout rather than treating those runs as failures.
COPILOT_REQUEST_TIMEOUT = int(os.environ.get("COPILOT_REQUEST_TIMEOUT", "600"))
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
    protocol_version = "HTTP/1.1"
    timeout = 30
    max_request_body_size = 32 * 1024 * 1024

    def __init__(self, *args, **kw):
        super().__init__(*args, directory=str(ROOT), **kw)

    def end_headers(self):
        # Dev server: never let the browser cache HTML / CSS / ES modules.
        # Without this, editing js/*.js and reloading can still run the old
        # cached module (ES modules cache aggressively), which shows up as
        # levels mysteriously "not running" or fixes not taking effect.
        # no-store forces a fresh fetch on every reload — no hard-refresh
        # needed. Harmless on the JSON proxy responses.
        self.send_header("Cache-Control", "no-store, max-age=0")
        super().end_headers()

    # ---- CORS preflight for proxy ----
    def do_OPTIONS(self):
        if self._read_request_body() is None:
            return
        self.send_response(204)
        for k, v in CORS_HEADERS.items():
            self.send_header(k, v)
        self.end_headers()

    def do_HEAD(self):
        if self._read_request_body() is None:
            return
        if self.path == "/healthz":
            return self._health()
        return super().do_HEAD()

    def do_GET(self):
        if self._read_request_body() is None:
            return
        if self.path == "/healthz":
            return self._health()
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
        body = self._read_request_body()
        if body is None:
            return
        self._request_body = body
        if self.path.startswith("/azure/"):
            return self._proxy_azure()
        if self.path == "/copilot/login/start":
            return self._copilot_login_start()
        if self.path == "/copilot/login/poll":
            return self._copilot_login_poll()
        if self.path.startswith("/copilot/"):
            return self._proxy_copilot()
        self.send_error(404, "Not Found")

    def _health(self):
        self._respond(200, b"ok\n", "text/plain; charset=utf-8")

    def _read_request_body(self):
        lengths = self.headers.get_all("Content-Length", [])
        if "Transfer-Encoding" in self.headers:
            if lengths:
                self.send_error(400, "Ambiguous request body framing")
            else:
                self.send_error(501, "Transfer-Encoding is not supported")
            return None
        if len(lengths) > 1:
            self.send_error(400, "Multiple Content-Length headers are not supported")
            return None

        length_text = lengths[0].strip() if lengths else "0"
        if not length_text.isascii() or not length_text.isdecimal():
            self.send_error(400, "Invalid Content-Length")
            return None
        try:
            length = int(length_text)
        except ValueError:
            self.send_error(400, "Invalid Content-Length")
            return None
        if length > self.max_request_body_size:
            self.send_error(413, "Request body too large")
            return None

        try:
            body = self.rfile.read(length)
        except TimeoutError:
            self.send_error(408, "Request body read timed out")
            return None
        if len(body) != length:
            self.send_error(400, "Incomplete request body")
            return None
        return body

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
        try:
            payload = json.loads(self._request_body or b"{}")
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
        self._respond(status, body, "application/json; charset=utf-8")

    def _respond(self, status, body, content_type):
        body_allowed = not (100 <= status < 200 or status in (204, 304))
        if status == 205:
            body = b""
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        if body_allowed:
            self.send_header("Content-Length", str(len(body)))
        for name, value in CORS_HEADERS.items():
            self.send_header(name, value)
        self.end_headers()
        if body_allowed and self.command != "HEAD":
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
        self._respond_json(200, body)

    # ---- Copilot proxy ----
    def _relay_model_response(self, resp):
        content_type = resp.headers.get("Content-Type", "application/json; charset=utf-8")
        if "text/event-stream" not in content_type:
            return self._respond(resp.status, resp.read(), content_type)
        # Do not buffer a multi-minute review before returning its activity.
        # Close-delimited HTTP/1.1 keeps framing correct without Content-Length.
        self.send_response(resp.status)
        self.send_header("Content-Type", content_type)
        self.send_header("Connection", "close")
        self.send_header("X-Accel-Buffering", "no")
        for key, value in CORS_HEADERS.items():
            self.send_header(key, value)
        self.end_headers()
        self.close_connection = True
        try:
            while True:
                chunk = resp.read1(4096)
                if not chunk:
                    break
                self.wfile.write(chunk)
                self.wfile.flush()
        except (BrokenPipeError, ConnectionResetError):
            pass
        except Exception:
            # Headers are already sent; never append a second HTTP response.
            try:
                self.wfile.write(b'\n\ndata: {"type":"error","error":{"message":"Model connection interrupted. No partial score was accepted."}}\n\n')
                self.wfile.flush()
            except OSError:
                pass

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
        body = self._request_body if method == "POST" else None

        req_headers = {
            "Authorization": f"Bearer {tok}",
            "Accept": "text/event-stream, application/json",
            "Copilot-Integration-Id": "vscode-chat",
            **COPILOT_EDITOR_HEADERS,
        }
        if method == "POST":
            req_headers["Content-Type"] = self.headers.get("Content-Type", "application/json")
        req = urllib.request.Request(target, data=body, method=method, headers=req_headers)
        try:
            with urllib.request.urlopen(req, timeout=COPILOT_REQUEST_TIMEOUT, context=SSL_CTX) as resp:
                self._relay_model_response(resp)
        except urllib.error.HTTPError as e:
            self._respond_json(e.code, e.read())
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

        req = urllib.request.Request(
            target, data=self._request_body, method="POST",
            headers={
                "Content-Type": self.headers.get("Content-Type", "application/json"),
                "api-key": key,
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=120, context=SSL_CTX) as resp:
                self._relay_model_response(resp)
        except urllib.error.HTTPError as e:
            self._respond_json(e.code, e.read())
        except Exception as e:
            self._json_error(502, f"Proxy error: {e}")

    def _json_error(self, code, msg):
        body = json.dumps({"error": msg}).encode()
        self._respond_json(code, body)

    # quieter logs
    def log_message(self, fmt, *args):
        sys.stderr.write(f"[{self.log_date_time_string()}] {fmt % args}\n")


class ReusableTCP(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True
    request_queue_size = 128


if __name__ == "__main__":
    with ReusableTCP((HOST, PORT), Handler) as httpd:
        print("Bing Coherence Review Buddy - HTTP/1.1 server")
        print(f"  → listening on http://{HOST}:{PORT}")
        print(f"  → proxy at /azure/*   (forwards to Azure OpenAI)")
        print(f"  → proxy at /copilot/* (forwards to api.githubcopilot.com)")
        print(f"  → device-flow login at /copilot/login/{{start,poll}}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nbye.")
