import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    username?: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      id: string;
      username: string;
      profile_pic_url: string;
    } & DefaultSession["user"];
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    {
      id: "whop",
      name: "Whop",
      type: "oidc",
      checks: ["pkce", "nonce"],
      issuer: "https://api.whop.com",
      clientId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
      clientSecret: process.env.WHOP_CLIENT_SECRET ?? "",
      client: {
        token_endpoint_auth_method: "none",
        id_token_signed_response_alg: "ES256",
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: profile.username || profile.name || "",
        };
      },
    },
  ],
  callbacks: {
    jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.username = user.username || "";
        token.profile_pic_url = user.image || "";
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = (token.username as string) || "";
      session.user.profile_pic_url = (token.profile_pic_url as string) || "";
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
