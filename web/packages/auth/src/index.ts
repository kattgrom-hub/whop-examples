import NextAuth from "next-auth";
import "./types";

export type { WhopUser } from "./types";

const whopProvider = {
  id: "whop",
  name: "Whop",
  type: "oidc" as const,
  checks: ["pkce", "nonce"] as ("pkce" | "nonce")[],
  issuer: "https://api.whop.com",
  clientId: process.env.NEXT_PUBLIC_WHOP_APP_ID,
  clientSecret: process.env.WHOP_CLIENT_SECRET ?? "",
  client: {
    token_endpoint_auth_method: "none" as const,
    id_token_signed_response_alg: "ES256" as const,
  },
  profile(profile: Record<string, unknown>) {
    return {
      id: profile.sub as string,
      name: profile.name as string,
      email: profile.email as string,
      image: profile.picture as string,
      username: (profile.username as string) || (profile.name as string) || "",
    };
  },
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface WhopAuthOptions {
  callbacks?: {
    jwt?: (params: any) => any;
    session?: (params: any) => any;
  };
  pages?: {
    signIn?: string;
  };
}

export function createWhopAuth(options?: WhopAuthOptions) {
  return NextAuth({
    providers: [whopProvider],
    callbacks: {
      async jwt(params) {
        const { token, user, account } = params;
        if (user && account) {
          token.id = account.providerAccountId;
          token.username = user.username || "";
          token.profile_pic_url = user.image || "";
          token.accessToken = account.access_token;
        }
        // Run app-specific JWT callback if provided
        if (options?.callbacks?.jwt) {
          return (options.callbacks.jwt as Function)(params);
        }
        return token;
      },
      session(params) {
        const { session, token } = params;
        session.user.id = token.id as string;
        session.user.username = (token.username as string) || "";
        session.user.profile_pic_url =
          (token.profile_pic_url as string) || "";
        session.accessToken = token.accessToken as string;
        // Run app-specific session callback if provided
        if (options?.callbacks?.session) {
          return (options.callbacks.session as Function)(params);
        }
        return session;
      },
    },
    pages: {
      signIn: options?.pages?.signIn ?? "/auth/login",
    },
  });
}
