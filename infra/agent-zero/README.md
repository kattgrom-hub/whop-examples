# Agent Zero v2.14 private trial

Agent Zero is a separate Docker service. This directory adds no checkout routes,
payment handling, customer access, or changes to the existing Vercel application.

## Docker host

1. Install Docker with Compose.
2. In this directory create a private `.env` with `AUTH_LOGIN` and
   `AUTH_PASSWORD`. Choose your own non-empty credentials; never commit the file.
3. Run `docker compose config --quiet`, then `docker compose up -d`.
4. Open http://localhost:5080 and sign in.
5. Configure your model provider through Agent Zero's settings and verify a chat.

The UI binds to loopback. For remote access use an SSH tunnel
(`ssh -L 5080:127.0.0.1:5080 user@host`) or a separately configured authenticated
HTTPS gateway. User data is stored in the `agent_zero_usr` Docker volume.
Back it up before upgrading. Do not run `docker compose down -v` unless you
intend to delete the stored data.

## Vercel trial created on 14 October 2026 UTC

- Team: kattgrom-hubs-projects
- Project: whop-examples
- Sandbox: agent-zero-v214-check
- Region: syd1
- Container: agent-zero-v214
- Port: 127.0.0.1:5080 (no public Sandbox route)
- Official image verified and pulled:
  `agent0ai/agent-zero@sha256:b0c9763df7b8c4c5ddbdac9c101e8f84de8b7cdf9185203e446e2d7d8ebf2f1c`

Docker was installed and the application boot was checked: GET / redirects to
/login and GET /login returns 200. This verifies startup and the login gate,
not a model response or Whop connection. The sandbox trial uses a generated
local credential file at /vercel/agent-zero/runtime.env; its contents are not
committed or exposed.

Sandbox sessions are time-limited. Filesystem snapshots can preserve the
installation, but running processes do not survive a stop. Resume the named
sandbox through Vercel, start Docker, then start the existing container:

```sh
sudo sh -c 'nohup dockerd >/tmp/agent-zero-docker.log 2>&1 </dev/null &'
# After docker info succeeds:
sudo docker start agent-zero-v214
```

Before making the UI reachable from your phone, set your own credentials
directly in the hosting environment and configure an authenticated HTTPS access
path. Never expose the installation without an owner login.

This trial is not an always-on Vercel website or production host. Sandbox
compute, snapshots and network usage may incur Vercel charges. Default snapshot
retention applies; retain an independent backup for long-term use.

## Whop

The selected Whop plugin supplies onboarding guidance, not authenticated account
tools. No Whop account, product, checkout, payment or webhook was changed.
The official live-account MCP endpoint is https://mcp.whop.com/mcp.
Connect it through a supported MCP client and complete Whop's browser sign-in;
plugin selection alone does not establish that connection.
Agent Zero-specific OAuth compatibility remains unverified. Do not put live
payment credentials into an unverified integration.

## Sources

- https://github.com/agent0ai/agent-zero/releases/tag/v2.14
- https://github.com/agent0ai/agent-zero/blob/v2.14/docs/setup/installation.md
- https://vercel.com/docs/sandbox
- https://docs.whop.com/developer/guides/ai_and_mcp
