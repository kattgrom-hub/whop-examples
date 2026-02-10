import NextAuth from "next-auth";
import type { DefaultSession } from "next-auth";
import { getCompanyIdByUserId, upsertInstructorEntry } from "@/lib/blob/instructors-index";
import { getWhopApi } from "@/lib/whop-sdk";

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
      companyId: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    profile_pic_url?: string;
    accessToken?: string;
    companyId?: string;
  }
}

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

/**
 * Find an existing connected account for a user.
 * Checks blob first, falls back to Whop API scan. Never creates.
 */
async function findConnectedAccount(userId: string): Promise<string | null> {
  try {
    const cached = await getCompanyIdByUserId(userId);
    if (cached) return cached;

    if (!PLATFORM_COMPANY_ID) return null;

    // Scan Whop API and sync to blob
    const client = getWhopApi();
    const accounts = await client.companies.list({ parent_company_id: PLATFORM_COMPANY_ID });
    for await (const account of accounts) {
      const meta = account.metadata as Record<string, string> | undefined;
      if (account.owner_user?.id === userId || meta?.user_id === userId) {
        let categories: string[] = [];
        try { if (meta?.categories) categories = JSON.parse(meta.categories); } catch {}
        await upsertInstructorEntry(account.id, {
          name: account.title || "",
          avatarUrl: account.logo?.url || "",
          plan: (meta?.plan as "core" | "pro") || "core",
          categories,
        }, userId).catch(() => {});
        return account.id;
      }
    }
    return null;
  } catch (error) {
    console.error("findConnectedAccount error:", error);
    return null;
  }
}

/**
 * Ensure the user has a connected account (Whop Company) on first sign-in.
 * Finds existing account first, creates only if none exists.
 */
async function ensureConnectedAccount(
  userId: string,
  email: string,
  name?: string | null,
  image?: string | null,
): Promise<string | null> {
  // Find existing first
  const existing = await findConnectedAccount(userId);
  if (existing) return existing;

  if (!PLATFORM_COMPANY_ID) return null;

  // No account found — create one
  try {
    const client = getWhopApi();
    const newAccount = await client.companies.create({
      email,
      parent_company_id: PLATFORM_COMPANY_ID,
      title: name || `Instructor ${userId.slice(0, 8)}`,
      metadata: { user_id: userId, email, plan: "core" },
    });

    await upsertInstructorEntry(newAccount.id, {
      name: name || "",
      avatarUrl: image || "",
      plan: "core",
      categories: [],
    }, userId);

    return newAccount.id;
  } catch (error) {
    console.error("Failed to create connected account:", error);
    return null;
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
      clientSecret: process.env.WHOP_CLIENT_SECRET || "unused",
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
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.username = user.username || "";
        token.profile_pic_url = user.image || "";

        // First sign-in: find or create connected account
        const companyId = await ensureConnectedAccount(
          user.id!,
          user.email!,
          user.name,
          user.image,
        );
        token.companyId = companyId || "";
      }

      // Backfill: existing sessions that predate this change (find only, never create)
      if (!token.companyId && token.id) {
        const companyId = await findConnectedAccount(token.id);
        if (companyId) token.companyId = companyId;
      }

      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.profile_pic_url = token.profile_pic_url as string;
      session.user.companyId = token.companyId as string;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
});
