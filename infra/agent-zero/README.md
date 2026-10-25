# Agent Zero v2.14 with Whop browser authorization

This directory contains the private Agent Zero trial setup and the Whop OAuth
handoff adapter. It runs independently of the repository's storefront.

## Docker host

Create a private `.env` containing non-empty `AUTH_LOGIN` and `AUTH_PASSWORD`.
Install Docker with Compose, then run:

```sh
docker compose config --quiet
docker compose up -d
```

Open http://localhost:5080. The Compose example binds only to loopback; use an
SSH tunnel or an authenticated HTTPS gateway for remote access. User data is
stored in the `agent_zero_usr` volume. Back it up before upgrades and never
delete that volume unintentionally.

Configure model access through Agent Zero's settings. No model response has
been verified in this trial.

## Vercel trial

- Team: kattgrom-hubs-projects
- Project: whop-examples
- Sandbox: agent-zero-v214-check
- Region: syd1
- Agent Zero container: agent-zero-v214
- Agent UI: sandbox HTTPS route for port 5080, protected by owner login
- OAuth callback: sandbox HTTPS route for port 9697
- Internal callback: host loopback port 9696 mapped to container port 9696
- Image:
  `agent0ai/agent-zero@sha256:b0c9763df7b8c4c5ddbdac9c101e8f84de8b7cdf9185203e446e2d7d8ebf2f1c`

The current UI login was tested over HTTPS. Credentials and OAuth state are
kept in the hosting environment, never in this repository.

Sandbox sessions are capped at 45 minutes in this trial. Snapshots preserve
files, not processes. Routes may change between sessions, so a resume requires
starting Docker/the container, restarting the callback helper, and refreshing
the bridge's external callback URL. Default snapshot retention is seven days.
Compute, network and snapshots may incur Vercel charges.

## Whop connection

Agent Zero v2.14's native MCP transport does not supply an OAuth provider.
Whop's live MCP requires browser OAuth, so URL-only setup is insufficient.

The trial installs the exact `mcp-remote@0.14.3` package under
`/a0/usr/whop-mcp-bridge`, using `npm install --save-exact --ignore-scripts`.
`patch_whop_bridge.py` adapts that exact version for the trial HTTPS callback
and records only the generated sign-in handoff URL/state, not access tokens.
It verifies the package version and expected source before modifying it and
is safe to rerun after a complete successful patch.

The Node bridge's callback binds inside Docker and is published only to the
host loopback interface. `whop_callback.py` exposes just
`/oauth/callback` through HTTPS. It checks state, expiry, issuer, duplicate
parameters and replay before forwarding to the internal callback. It logs no
requests or authorization codes. Unknown routes and invalid state are rejected.

`refresh_whop.py` waits for owner consent and token-file creation, then asks
the running Agent Zero API to refresh MCP tools. It needs the newly configured
UI password in its private `A0_INITIAL_PASSWORD` process environment. It never
prints that password or reads OAuth token contents. The refresh stops after
20 minutes or a successful live connection.

Agent Zero settings contain:
- Whop documentation: native streamable HTTP, https://docs.whop.com/mcp
- Live Whop: the pinned local Node bridge, https://mcp.whop.com/mcp

The live bridge receives `MCP_REMOTE_CONFIG_DIR` (private token storage),
`MCP_REMOTE_PENDING_FILE`, `MCP_REMOTE_REDIRECT_URL` (current HTTPS callback),
`MCP_REMOTE_CALLBACK_BIND=0.0.0.0` (Docker-side only), and
`NODE_EXTRA_CA_CERTS` for the Vercel proxy trust certificate.

Whop advertises the admin scope. The owner must review and approve that access
on Whop's sign-in page. Installing or selecting a plugin does not authorize it.

## Verified and pending

Verified:
- Official v2.14 image booted.
- Unauthenticated UI redirects to login; owner login succeeds over HTTPS.
- Compose validates and rejects missing owner credentials.
- Whop documentation MCP is connected with three tools.
- Whop OAuth registration produced a browser sign-in URL.
- Invalid state is rejected on the public HTTPS callback.
- Ten callback validation tests pass; Python and patched Node syntax checks pass.

Pending:
- Owner Whop sign-in/consent.
- Live-account MCP tool discovery after consent.
- Model-provider sign-in and a successful chat.
- Always-on hosting.

No purchases, refunds, payouts or customer-data operations were performed.

## Checks

```sh
python3 -m unittest -q test_whop_callback
python3 -m py_compile patch_whop_bridge.py whop_callback.py refresh_whop.py
```

## Sources

- https://github.com/agent0ai/agent-zero/releases/tag/v2.14
- https://github.com/agent0ai/agent-zero/blob/v2.14/docs/guides/mcp-setup.md
- https://docs.whop.com/developer/guides/ai_and_mcp
- https://github.com/punkpeye/mcp-remote
- https://vercel.com/docs/sandbox
