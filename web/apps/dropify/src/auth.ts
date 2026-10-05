import { createWhopAuth } from "@whop-examples/auth";

export const { auth, handlers, signIn, signOut } = createWhopAuth({
  scopes: (process.env.WHOP_WALLET_OAUTH_SCOPES || "").split(",").map(s => s.trim()).filter(Boolean),
  callbacks: {
    jwt: ({ token, account }) => {
      if (account) {
        token.walletScopes = account.scope || "";
        token.walletExpiresAt = account.expires_at;
        // The existing Whop OIDC provider authenticates against production.
        token.walletEnvironment = "production";
      }
      return token;
    },
    session: ({ session }) => {
      delete session.accessToken;
      return session;
    },
  },
});
