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

import http.server
import json
import os
import socketserver
import ssl
import sys
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
        "Content-Type, X-Azure-Endpoint, X-Azure-Deployment, X-Azure-Key",
    "Access-Control-Max-Age": "86400",
}


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kw):
        super().__init__(*args, directory=str(ROOT), **kw)

    # ---- CORS preflight for proxy ----
    def do_OPTIONS(self):
        self.send_response(204)
        for k, v in CORS_HEADERS.items():
            self.send_header(k, v)
        self.end_headers()

    def do_POST(self):
        if self.path.startswith("/azure/"):
            return self._proxy_azure()
        self.send_error(404, "Not Found")

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
        print(f"Coherence Review Agent demo + Azure OpenAI proxy")
        print(f"  → listening on http://{HOST}:{PORT}")
        print(f"  → proxy at /azure/* (forwards to Azure OpenAI)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nbye.")
