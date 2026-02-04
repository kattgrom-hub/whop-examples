import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

/**
 * Coach Sessions API
 *
 * GET: Fetches available sessions and booked sessions for a coach.
 * POST: Creates a new available session slot that students can book.
 */

export interface AvailableSession {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: "available";
}

export interface BookedSession {
  id: string;
  title: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  date: string;
  time: string;
  duration: number;
  amount: number;
  status: "upcoming" | "completed" | "cancelled";
}

/**
 * POST: Create a new available session slot
 *
 * Coaches create available time slots that students can browse and book.
 * This creates a visible Plan under the coach's product.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userEmail, userName, title, description, date, time, duration, price } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!title || !date || !time) {
      return NextResponse.json(
        { error: "title, date, and time are required" },
        { status: 400 }
      );
    }

    if (!PLATFORM_COMPANY_ID) {
      return NextResponse.json(
        { error: "Platform company ID not configured" },
        { status: 500 }
      );
    }

    const client = getWhopApi();
    console.log("[sessions] Starting session creation for userId:", userId);

    // Step 1: Find the coach's connected account
    console.log("[sessions] Step 1: Finding connected account...");
    const connectedAccounts = await client.companies.list({
      parent_company_id: PLATFORM_COMPANY_ID,
    });

    let coachCompanyId: string | null = null;
    for await (const account of connectedAccounts) {
      const metadata = account.metadata as Record<string, string> | undefined;
      if (
        account.owner_user?.id === userId ||
        metadata?.user_id === userId
      ) {
        coachCompanyId = account.id;
        break;
      }
    }

    // Auto-create connected account if it doesn't exist
    if (!coachCompanyId) {
      console.log("[sessions] No connected account found, creating one...");
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
      console.log("[sessions] Using appUrl:", appUrl);
      const connectedAccountResponse = await fetch(
        `${appUrl}/api/coach/connected-account`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            email: userEmail || `${userId}@coach.local`,
            name: userName || "Coach",
          }),
        }
      );

      if (!connectedAccountResponse.ok) {
        const error = await connectedAccountResponse.json();
        return NextResponse.json(
          { error: error.error || "Failed to create connected account" },
          { status: 500 }
        );
      }

      const { company } = await connectedAccountResponse.json();
      coachCompanyId = company.id;
      console.log("[sessions] Created connected account:", coachCompanyId);
    } else {
      console.log("[sessions] Found existing connected account:", coachCompanyId);
    }

    if (!coachCompanyId) {
      return NextResponse.json(
        { error: "Failed to get or create connected account" },
        { status: 500 }
      );
    }

    // Step 2: Create a Product for this session slot
    console.log("[sessions] Step 2: Creating session product...");
    // We store session metadata in the product description as JSON
    const sessionMetadata = {
      type: "coaching_session",
      title: title,
      description: description || "",
      date: date,
      time: time,
      duration: String(duration || 60),
      price: String(price || 0),
    };

    const sessionProduct = await client.products.create({
      company_id: coachCompanyId,
      title: title,
      description: JSON.stringify(sessionMetadata),
      visibility: "visible",
    });
    console.log("[sessions] Created product:", sessionProduct.id);

    // Step 3: Create a plan for this session
    console.log("[sessions] Step 3: Creating plan...");
    const priceInCents = Math.round((price || 0) * 100);
    const plan = await client.plans.create({
      company_id: coachCompanyId,
      product_id: sessionProduct.id,
      plan_type: "one_time",
      initial_price: priceInCents / 100,
      visibility: "visible",
      release_method: "buy_now",
    });
    console.log("[sessions] Created plan:", plan.id);
    console.log("[sessions] Session created successfully!");

    return NextResponse.json({
      success: true,
      productId: sessionProduct.id,
      planId: plan.id,
      session: {
        id: sessionProduct.id,
        title,
        description: description || "",
        date,
        time,
        duration: duration || 60,
        price: price || 0,
        status: "available",
      },
    });
  } catch (error) {
    console.error("Failed to create session:", error);
    // Log full error details
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to create session: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Update an existing session
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, title, description, date, time, duration, price } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    const client = getWhopApi();

    // Update the product
    const sessionMetadata = {
      type: "coaching_session",
      title: title,
      description: description || "",
      date: date,
      time: time,
      duration: String(duration || 60),
      price: String(price || 0),
    };

    const updatedProduct = await client.products.update(sessionId, {
      title: title,
      description: JSON.stringify(sessionMetadata),
    });

    console.log("[sessions] Updated session:", sessionId);

    return NextResponse.json({
      success: true,
      session: {
        id: updatedProduct.id,
        title,
        description: description || "",
        date,
        time,
        duration: duration || 60,
        price: price || 0,
        status: "available",
      },
    });
  } catch (error) {
    console.error("Failed to update session:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to update session: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Remove a session (hide the product)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    const client = getWhopApi();

    // Hide the product instead of deleting (Whop doesn't support delete)
    await client.products.update(sessionId, {
      visibility: "hidden",
    });

    console.log("[sessions] Deleted (hidden) session:", sessionId);

    return NextResponse.json({
      success: true,
      message: "Session deleted",
    });
  } catch (error) {
    console.error("Failed to delete session:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to delete session: ${errorMessage}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const coachCompanyIdParam = request.nextUrl.searchParams.get("coachId");

  // Either userId (for coach viewing their own) or coachId (for students browsing)
  if (!userId && !coachCompanyIdParam) {
    return NextResponse.json(
      { error: "userId or coachId is required" },
      { status: 400 }
    );
  }

  if (!PLATFORM_COMPANY_ID) {
    return NextResponse.json(
      { error: "Platform company ID not configured" },
      { status: 500 }
    );
  }

  try {
    const client = getWhopApi();

    let coachCompanyId: string | null = coachCompanyIdParam;

    // If userId provided, find the coach's connected account
    if (userId && !coachCompanyId) {
      const connectedAccounts = await client.companies.list({
        parent_company_id: PLATFORM_COMPANY_ID,
      });

      for await (const account of connectedAccounts) {
        const metadata = account.metadata as Record<string, string> | undefined;
        if (
          account.owner_user?.id === userId ||
          metadata?.user_id === userId
        ) {
          coachCompanyId = account.id;
          break;
        }
      }
    }

    if (!coachCompanyId) {
      return NextResponse.json(
        { error: "No connected account found" },
        { status: 404 }
      );
    }

    // Step 1: Get available sessions (products with coaching_session type)
    const availableSessions: AvailableSession[] = [];
    const products = await client.products.list({
      company_id: coachCompanyId,
    });

    for await (const product of products) {
      // Fetch full product details
      const fullProduct = await client.products.retrieve(product.id);
      const description = fullProduct.description || "";

      // Only include coaching session products (not the main profile)
      if (!description.startsWith('{"type":"coaching_session"')) {
        continue;
      }

      // Only include visible products
      if (fullProduct.visibility !== "visible") {
        continue;
      }

      // Parse metadata from description
      let metadata: Record<string, string> = {};
      try {
        metadata = JSON.parse(description);
      } catch {
        continue;
      }

      availableSessions.push({
        id: fullProduct.id,
        title: metadata.title || fullProduct.title || "Coaching Session",
        description: metadata.description || "",
        date: metadata.date || "",
        time: metadata.time || "",
        duration: parseInt(metadata.duration || "60", 10),
        price: parseFloat(metadata.price || "0"),
        status: "available",
      });
    }

    // Sort available sessions by date (earliest first)
    availableSessions.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

    // Step 2: Get booked sessions (memberships)
    const bookedSessions: BookedSession[] = [];
    const memberships = await client.memberships.list({
      company_id: coachCompanyId,
    });

    const now = new Date();

    for await (const membership of memberships) {
      const user = membership.user;
      const metadata = membership.metadata as Record<string, string> | undefined;

      // Parse session info from metadata
      const title = metadata?.title || "Coaching Session";
      const timeSlot = metadata?.time_slot || "";
      const sessionDate = metadata?.date || "";
      const sessionTime = metadata?.time || "";

      // Determine session date/time
      const createdAt = new Date(membership.created_at);
      let sessionDateTime: Date;

      if (sessionDate && sessionTime) {
        sessionDateTime = new Date(`${sessionDate} ${sessionTime}`);
      } else if (timeSlot) {
        sessionDateTime = new Date(timeSlot);
      } else {
        sessionDateTime = createdAt;
      }

      // Determine status
      let status: "upcoming" | "completed" | "cancelled";
      if (membership.canceled_at) {
        status = "cancelled";
      } else if (sessionDateTime < now) {
        status = "completed";
      } else {
        status = "upcoming";
      }

      bookedSessions.push({
        id: membership.id,
        title,
        studentName: user?.name || user?.username || "Anonymous",
        studentEmail: user?.email || "",
        studentAvatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${user?.id || membership.id}`,
        date: sessionDate || createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        time: sessionTime || timeSlot || createdAt.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        duration: parseInt(metadata?.duration || "60", 10),
        amount: 0, // Would need to fetch plan for actual price
        status,
      });
    }

    // Sort booked sessions (upcoming first, then by date)
    bookedSessions.sort((a, b) => {
      if (a.status === "upcoming" && b.status !== "upcoming") return -1;
      if (a.status !== "upcoming" && b.status === "upcoming") return 1;
      return new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime();
    });

    return NextResponse.json({
      availableSessions,
      bookedSessions,
      coachCompanyId,
    });
  } catch (error) {
    console.error("Failed to fetch coach sessions:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to fetch sessions: ${errorMessage}` },
      { status: 500 }
    );
  }
}
