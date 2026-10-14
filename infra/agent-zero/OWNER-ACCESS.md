# Temporary owner access

The private trial supports a five-minute, one-use owner sign-in link through `owner_access.py`, installed in `/a0/usr/api`. It accepts a 256-bit random token whose SHA-256 hash and expiration are stored in a mode-0600 `/a0/usr/owner-access.json` file. Never commit the state file or the link.

GET validates the link and displays a Sign in button without consuming it, so link previews cannot use it. POST checks the token again under the shared application lock, marks it used, sets Agent Zero's existing authentication session and redirects to `/`. Invalid, expired, duplicate and reused tokens are rejected. The route does not disable the normal owner login or change Whop permissions. Responses disable caching and referrers.

Verified against the private HTTPS trial: a GET preview leaves the token unused; POST creates an authenticated session that survives navigation; invalid tokens, replays and expired links return 403. Trial hosting still has a session timeout.
