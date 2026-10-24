"""Refresh Agent Zero's Whop MCP after the owner finishes browser consent."""
import http.cookiejar,json,os,time,urllib.parse,urllib.request
from pathlib import Path
root=Path("/var/lib/docker/volumes/agent_zero_usr/_data")
pending=root/"whop-mcp-bridge/auth-pending.json"
status_path=Path("/vercel/agent-zero/whop-connection-status.json")
deadline=time.time()+1200
base="http://127.0.0.1:5080"
last_status=None
def record(status):
    global last_status
    status_path.write_text(json.dumps(status))
    last_status=status
while time.time()<deadline:
    try:
        p=json.loads(pending.read_text())
        if not p.get("used") or not any((root/"whop-mcp-auth").rglob("*tokens.json")):
            time.sleep(3); continue
        jar=http.cookiejar.CookieJar()
        client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
        client.open(base+"/login",data=urllib.parse.urlencode({
            "username":"katy","password":os.environ["A0_INITIAL_PASSWORD"]}).encode(),timeout=10)
        csrf=json.loads(client.open(base+"/api/csrf_token",timeout=10).read())["token"]
        headers={"X-CSRF-Token":csrf,"Content-Type":"application/json"}
        settings=json.loads(client.open(urllib.request.Request(base+"/api/settings_get",headers=headers),timeout=10).read())
        config=settings["settings"]["mcp_servers"]
        result=json.loads(client.open(urllib.request.Request(base+"/api/mcp_servers_apply",
            data=json.dumps({"mcp_servers":config}).encode(),headers=headers),timeout=30).read())
        server=next((s for s in result.get("status",[]) if s.get("name")=="whop"),{})
        record({"whop_connected":bool(server.get("connected")),"tool_count":server.get("tool_count",0)})
        if server.get("connected"): break
    except Exception:
        record({"whop_connected":False,"action":"Check sign-in and apply MCP settings"})
    time.sleep(5)
else:
    if last_status is None:
        record({"whop_connected":False,"action":"Browser authorization expired; restart sign-in"})
