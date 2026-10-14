"""One-use owner sign-in for the private Agent Zero trial."""
import hashlib,hmac,json,time
from pathlib import Path
from helpers.api import ApiHandler,Request,Response,session
from helpers import login

STATE=Path("/a0/usr/owner-access.json")

def consume(token, state, now):
    if not isinstance(token,str) or len(token)!=64 or state.get("used"):
        return False
    expires=state.get("expires")
    if not isinstance(expires,(int,float)) or now>=expires:
        return False
    expected=state.get("hash","")
    if not isinstance(expected,str) or len(expected)!=64:
        return False
    return hmac.compare_digest(hashlib.sha256(token.encode()).hexdigest(),expected)

class OwnerAccess(ApiHandler):
    @classmethod
    def requires_auth(cls): return False
    @classmethod
    def requires_csrf(cls): return False
    @classmethod
    def get_methods(cls): return ["GET","POST"]

    async def process(self,input,request:Request):
        headers={"Cache-Control":"no-store","Referrer-Policy":"no-referrer",
                 "X-Frame-Options":"DENY"}
        with self.thread_lock:
            try: state=json.loads(STATE.read_text())
            except (OSError,ValueError):
                return Response("This sign-in link is unavailable.",403,headers=headers)
            values=(request.args if request.method=="GET" else request.form).getlist("token")
            if len(values)!=1 or not consume(values[0],state,time.time()):
                return Response("This sign-in link expired or has already been used.",403,headers=headers)
            if request.method=="GET":
                page=('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">'
                      '<title>Sign in to Agent Zero</title></head><body style="background:#111;color:#fff;'
                      'font-family:system-ui;text-align:center;padding:60px 20px">'
                      '<h1>Agent Zero</h1><p>Sign in as katy.</p>'
                      '<form method="POST" action="/api/owner_access">'
                      '<input type="hidden" name="token" value="'+values[0]+'">'
                      '<button type="submit" style="font-size:20px;padding:16px 28px;border:0;'
                      'border-radius:12px;background:#62d9c5">Sign in</button></form>'
                      '<p>This private link expires in five minutes.</p></body></html>')
                return Response(page,200,headers=headers,mimetype="text/html")
            credential_hash=login.get_credentials_hash()
            if not credential_hash:
                return Response("Owner authentication is not configured.",503,headers=headers)
            state["used"]=True
            STATE.write_text(json.dumps(state)); STATE.chmod(0o600)
            session["authentication"]=credential_hash
        headers["Location"]="/"
        return Response("",302,headers=headers)
