import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

/**
 * Sessions List API
 *
 * Lists all available sessions across all coaches.
 * Sessions are Products with {"type":"coaching_session"} in description.
 */

export interface SessionListItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  coachId: string;
  coachName: string;
  coachAvatar: string;
}

export async function GET(request: NextRequest) {
  if (!PLATFORM_COMPANY_ID) {
    return NextResponse.json(
      { error: "Platform company ID not configured" },
      { status: 500 }
    );
  }

  try {
    const client = getWhopApi();

    // List all connected accounts under the platform
    const connectedAccounts = await client.companies.list({
      parent_company_id: PLATFORM_COMPANY_ID,
    });

    const sessions: SessionListItem[] = [];

    // For each connected account, find their session products
    for await (const account of connectedAccounts) {
      try {
        const products = await client.products.list({
          company_id: account.id,
        });

        for await (const product of products) {
          const fullProduct = await client.products.retrieve(product.id);
          const description = fullProduct.description || "";

          // Only include coaching sessions
          if (!description.startsWith('{"type":"coaching_session"')) {
            continue;
          }

          // Only include visible products
          if (fullProduct.visibility !== "visible") {
            continue;
          }

          // Parse metadata
          let metadata: Record<string, string> = {};
          try {
            metadata = JSON.parse(description);
          } catch {
            continue;
          }

          // Get coach name from account
          const coachName = account.title || "Coach";

          sessions.push({
            id: fullProduct.id,
            title: metadata.title || fullProduct.title || "Session",
            description: metadata.description || "",
            date: metadata.date || "",
            time: metadata.time || "",
            duration: parseInt(metadata.duration || "60", 10),
            price: parseFloat(metadata.price || "0"),
            coachId: account.id,
            coachName: coachName,
            coachAvatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${account.id}`,
          });
        }
      } catch (err) {
        console.error(`Failed to fetch products for account ${account.id}:`, err);
      }
    }

    // Sort by date (earliest first)
    sessions.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

    return NextResponse.json({
      sessions,
      total: sessions.length,
    });
  } catch (error) {
    console.error("Failed to list sessions:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to list sessions: ${errorMessage}` },
      { status: 500 }
    );
  }
}
