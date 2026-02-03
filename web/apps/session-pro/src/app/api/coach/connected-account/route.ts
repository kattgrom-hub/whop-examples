import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

/**
 * Get or create a connected account for a coach.
 *
 * This endpoint:
 * 1. Looks up existing connected accounts under our platform
 * 2. Finds one matching the coach's user ID (stored in metadata or owner_user)
 * 3. If none exists, creates a new connected account for them
 *
 * This way we don't need a separate database - Whop stores the relationship.
 */
export async function POST(request: NextRequest) {
  console.log("POST /api/coach/connected-account called");
  console.log("PLATFORM_COMPANY_ID:", PLATFORM_COMPANY_ID);

  try {
    const { userId, email, name } = await request.json();
    console.log("Request body:", { userId, email, name });

    if (!userId || !email) {
      return NextResponse.json(
        { error: "userId and email are required" },
        { status: 400 }
      );
    }

    if (!PLATFORM_COMPANY_ID) {
      return NextResponse.json(
        { error: "Platform company ID not configured. Set NEXT_PUBLIC_WHOP_COMPANY_ID in .env.local" },
        { status: 500 }
      );
    }

    const client = getWhopApi();

    // Step 1: List all connected accounts under our platform
    console.log("Listing connected accounts under platform:", PLATFORM_COMPANY_ID);
    let connectedAccounts;
    try {
      connectedAccounts = await client.companies.list({
        parent_company_id: PLATFORM_COMPANY_ID,
      });
    } catch (listError) {
      console.error("Error listing companies:", listError);
      // If listing fails, the company might not be a platform yet
      // Try creating directly
      console.log("List failed, attempting to create connected account directly");
    }

    // Step 2: Find an existing connected account for this user
    // We check both owner_user.id and metadata.user_id
    let existingAccount = null;
    if (connectedAccounts) {
      for await (const account of connectedAccounts) {
        console.log("Checking account:", account.id, account.owner_user?.id);
        if (
          account.owner_user?.id === userId ||
          (account.metadata && account.metadata.user_id === userId)
        ) {
          existingAccount = account;
          break;
        }
      }
    }

    if (existingAccount) {
      console.log("Found existing account:", existingAccount.id);
      return NextResponse.json({
        company: existingAccount,
        created: false,
      });
    }

    // Step 3: No existing account found - create a new one
    console.log("Creating new connected account for:", email);
    try {
      const newAccount = await client.companies.create({
        email: email,
        parent_company_id: PLATFORM_COMPANY_ID,
        title: name || `Coach ${userId}`,
        metadata: {
          user_id: userId,
          email: email,
          created_via: "session_pro",
        },
      });

      console.log("Created new account:", newAccount.id);
      return NextResponse.json({
        company: newAccount,
        created: true,
      });
    } catch (createError) {
      // Handle "already exists" error - the account exists but we couldn't find it by user ID
      // This can happen if the account was created with a different user ID (e.g., dev login vs OAuth)
      const errorMessage = createError instanceof Error ? createError.message : String(createError);
      if (errorMessage.includes("already exists")) {
        console.log("Account already exists, searching all accounts...");
        // Re-list and return the first account we find (since there's only one per user typically)
        const accounts = await client.companies.list({
          parent_company_id: PLATFORM_COMPANY_ID,
        });
        for await (const account of accounts) {
          // Check if this account matches by metadata email or was created for this email
          const accountMetadata = account.metadata as Record<string, string> | undefined;
          if (accountMetadata?.email === email || accountMetadata?.user_id === userId) {
            console.log("Found existing account:", account.id);
            return NextResponse.json({
              company: account,
              created: false,
            });
          }
        }
        // If we still can't find it, return the first connected account
        // (user likely has one account under this platform)
        const allAccounts = await client.companies.list({
          parent_company_id: PLATFORM_COMPANY_ID,
        });
        for await (const account of allAccounts) {
          console.log("Returning first available account:", account.id);
          return NextResponse.json({
            company: account,
            created: false,
          });
        }
        // No accounts found at all
        return NextResponse.json({
          error: "A connected account exists but couldn't be linked. Please contact support.",
          existingRoute: true,
        }, { status: 409 });
      }
      throw createError;
    }
  } catch (error) {
    console.error("Failed to get/create connected account:", error);
    // Try to get more error details
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
      // Check for Whop API error details
      if ('status' in error) {
        errorMessage += ` (status: ${(error as { status: number }).status})`;
      }
    }
    return NextResponse.json(
      { error: `Failed to get/create connected account: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * Get the connected account for a coach by their user ID.
 */
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  if (!PLATFORM_COMPANY_ID) {
    console.error("NEXT_PUBLIC_WHOP_COMPANY_ID is not set");
    return NextResponse.json(
      { error: "Platform company ID not configured. Set NEXT_PUBLIC_WHOP_COMPANY_ID in .env.local" },
      { status: 500 }
    );
  }

  console.log("Looking up connected account for userId:", userId, "under platform:", PLATFORM_COMPANY_ID);

  try {
    const client = getWhopApi();

    // List connected accounts and find the one for this user
    const connectedAccounts = await client.companies.list({
      parent_company_id: PLATFORM_COMPANY_ID,
    });

    for await (const account of connectedAccounts) {
      if (
        account.owner_user?.id === userId ||
        (account.metadata && account.metadata.user_id === userId)
      ) {
        return NextResponse.json({ company: account });
      }
    }

    return NextResponse.json(
      { error: "No connected account found for this user" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Failed to get connected account:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to get connected account: ${errorMessage}` },
      { status: 500 }
    );
  }
}
