import { createWhopAuth } from "@whop-examples/auth";
import { getCompanyIdByUserId, upsertHostEntry } from "@/lib/blob/hosts-index";
import { getWhopApi } from "@/lib/whop-sdk";

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
        await upsertHostEntry(account.id, {
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
  const existing = await findConnectedAccount(userId);
  if (existing) return existing;

  if (!PLATFORM_COMPANY_ID) return null;

  try {
    const client = getWhopApi();
    const newAccount = await client.companies.create({
      email,
      parent_company_id: PLATFORM_COMPANY_ID,
      title: name || `Host ${userId.slice(0, 8)}`,
      metadata: { user_id: userId, email, plan: "core" },
    });

    await upsertHostEntry(newAccount.id, {
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

export const { auth, handlers, signIn, signOut } = createWhopAuth({
  scopes: [
    "openid",
    "profile",
    "email",
    "chat:message:create",
    "chat:read",
    "dms:read",
    "dms:message:manage",
    "dms:channel:manage",
    "support_chat:read",
    "support_chat:message:create",
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && account) {
        const companyId = await ensureConnectedAccount(
          token.id as string,
          user.email!,
          user.name,
          user.image,
        );
        token.companyId = companyId || "";
      }

      // Backfill: existing sessions with missing companyId
      if (!token.companyId && token.id) {
        if (token.email) {
          const companyId = await ensureConnectedAccount(
            token.id as string,
            token.email,
            token.name as string,
            token.profile_pic_url as string,
          );
          if (companyId) token.companyId = companyId;
        } else {
          const companyId = await findConnectedAccount(token.id as string);
          if (companyId) token.companyId = companyId;
        }
      }

      return token;
    },
    session({ session, token }) {
      session.user.companyId = token.companyId as string;
      return session;
    },
  },
});
