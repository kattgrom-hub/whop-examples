# Kattassie AI Business Manager

Mobile-first dashboard scaffold for monitoring Kattassie business services.

## Current status
- UI scaffold only; provider authentication and live business data are not wired up.
- Read-only operating principle.
- No write, payment, refund, publishing, withdrawal, or deletion actions.
- No API keys or credentials are stored in this repository.

## Deployment
This is a static HTML dashboard. Configure the Vercel project root directory as `apps/kattassie-ai-business-manager`. No build command or output directory is required.

## Planned integration sequence
1. GitHub read-only repository and workflow metadata.
2. Vercel read-only project and deployment metadata.
3. Dedicated Supabase project with a restricted read-only database role.
4. Whop API/MCP with minimum read scopes.

## MCP architecture
The dashboard is a web client, not an MCP server. The next backend phase should add a remotely hosted MCP server using the current official MCP SDK and Streamable HTTP transport, with OAuth authorization, per-provider least-privilege credentials, server-side secret storage, request validation, rate limiting, and audit logging. Do not expose MCP credentials or provider tokens to browser code.

## Security gates before live integrations
- OAuth or scoped credentials only.
- Secrets in encrypted server-side environment variables.
- Separate development and production credentials.
- Explicit user confirmation for any future write-capable tool.
- Never enable money movement, refunds, payouts, or publishing in the initial release.
