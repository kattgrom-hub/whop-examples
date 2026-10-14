"""Adapt the pinned mcp-remote 0.14.3 callback for a private Vercel trial."""
from pathlib import Path
import json
root = Path("/a0/usr/whop-mcp-bridge")
assert json.loads((root/"node_modules/mcp-remote/package.json").read_text())["version"] == "0.14.3"
targets = [
('return `http://${host}:${port}${callbackPath}`;', '''if (process.env.MCP_REMOTE_REDIRECT_URL) {
    const url = new URL(process.env.MCP_REMOTE_REDIRECT_URL);
    if (url.protocol !== "https:" || !url.hostname.endsWith(".vercel.run") ||
        url.username || url.password || url.port || url.pathname !== "/oauth/callback" ||
        url.search || url.hash) throw new Error("Invalid trial OAuth callback URL");
    return url.toString();
  }
  return `http://${host}:${port}${callbackPath}`;'''),
('const httpServer = app.listen(options.port, "127.0.0.1");',
 'const httpServer = app.listen(options.port, process.env.MCP_REMOTE_CALLBACK_BIND || "127.0.0.1");'),
('await this.preflightCachedDynamicClientRegistration(authorizationUrl);', '''await this.preflightCachedDynamicClientRegistration(authorizationUrl);
    if (process.env.MCP_REMOTE_PENDING_FILE) {
      const fs = await import("node:fs/promises");
      const state = authorizationUrl.searchParams.get("state");
      if (!state || state.length < 16) throw new Error("Missing OAuth state");
      const pending = {state, url: authorizationUrl.toString(), expires: Date.now() + 1200000};
      await fs.writeFile(process.env.MCP_REMOTE_PENDING_FILE + ".tmp",
        JSON.stringify(pending), {mode: 0o600});
      await fs.rename(process.env.MCP_REMOTE_PENDING_FILE + ".tmp", process.env.MCP_REMOTE_PENDING_FILE);
    }''')
]
for old,new in targets:
    hits=[p for p in (root/"node_modules/mcp-remote/dist").glob("*.js") if old in p.read_text()]
    assert len(hits)==1, "Pinned bridge source changed"
    p=hits[0]; source=p.read_text()
    assert source.count(old)==1, "Unexpected duplicate patch target"
    p.write_text(source.replace(old,new))
print("Pinned bridge callback adapter installed")
