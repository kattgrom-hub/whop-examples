"""Expose only the Whop OAuth callback after validating its pending state."""
import hmac, json, os, threading, time, urllib.parse, urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
PENDING = Path(os.environ["PENDING_FILE"])
LOCK = threading.Lock()

def valid_callback(path, query, pending, now):
    if path != "/oauth/callback" or pending.get("used"):
        return False
    if not isinstance(pending.get("expires"), (int, float)) or now > pending["expires"]:
        return False
    if set(query) - {"state", "code", "iss", "error", "error_description"}:
        return False
    if any(len(v) != 1 for v in query.values()):
        return False
    state = query.get("state", [""])[0]
    expected = pending.get("state", "")
    if not isinstance(expected, str) or len(expected) < 16 or not hmac.compare_digest(state.encode(), expected.encode()):
        return False
    if query.get("iss", ["https://mcp.whop.com"])[0] != "https://mcp.whop.com":
        return False
    return bool(query.get("code", [""])[0]) and len(query["code"][0]) <= 4096

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args): pass
    def respond(self, status, message):
        content = message.encode()
        self.send_response(status)
        for k,v in {"Content-Type":"text/plain; charset=utf-8", "Cache-Control":"no-store",
                    "Referrer-Policy":"no-referrer", "X-Frame-Options":"DENY",
                    "Content-Length":str(len(content))}.items(): self.send_header(k,v)
        self.end_headers()
        self.wfile.write(content)
    def do_GET(self):
        if len(self.path)>8192:
            return self.respond(400, "Invalid sign-in response.")
        url=urllib.parse.urlsplit(self.path)
        query=urllib.parse.parse_qs(url.query, keep_blank_values=True)
        with LOCK:
            try: pending=json.loads(PENDING.read_text())
            except (OSError, ValueError): return self.respond(403, "No active sign-in. Restart the Whop connection.")
            if not valid_callback(url.path, query, pending, time.time()*1000):
                return self.respond(403, "Invalid or expired sign-in response.")
            try:
                upstream=urllib.request.urlopen("http://127.0.0.1:9696/oauth/callback?"+url.query, timeout=10)
                status=upstream.status
                upstream.close()
            except Exception:
                return self.respond(502, "Sign-in could not finish. Restart the Whop connection.")
            if status != 200: return self.respond(502, "Sign-in was not accepted.")
            pending["used"]=True
            PENDING.write_text(json.dumps(pending))
            PENDING.chmod(0o600)
            self.respond(200, "Whop sign-in response received. Return to Agent Zero and check the connection status.")
    def do_POST(self): self.respond(405, "Method not allowed.")

if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0",9697), Handler).serve_forever()
