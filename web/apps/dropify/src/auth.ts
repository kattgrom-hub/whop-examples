import { createWhopAuth } from "@whop-examples/auth";

export const { auth, handlers, signIn, signOut } = createWhopAuth({
  scopes: (process.env.WHOP_WALLET_OAUTH_SCOPES || "")
    .split(",")
    .map((scope) => scope.trim())
    .filter(Boolean),
});
