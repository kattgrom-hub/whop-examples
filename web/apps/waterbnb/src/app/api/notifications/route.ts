import { NextRequest, NextResponse } from "next/server";

/**
 * Notifications API
 *
 * Send notifications to users via Whop Notifications API:
 * - Reservation reminders
 * - Reservation confirmations
 * - Payout notifications
 * - New messages
 *
 * TODO: Integrate Whop Notifications API
 */

type NotificationType =
  | "reservation_reminder"
  | "reservation_confirmed"
  | "reservation_received"
  | "payout_sent"
  | "new_message";

interface SendNotificationRequest {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendNotificationRequest = await request.json();

    const { userId, type, title, message, data } = body;

    console.log(`Sending notification to ${userId}:`, {
      type,
      title,
      message,
      data,
    });

    return NextResponse.json({
      success: true,
      notification: {
        id: `notif_${Date.now()}`,
        userId,
        type,
        title,
        message,
        sentAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    templates: [
      {
        type: "reservation_reminder",
        title: "Trip starting soon",
        message: "Your boat trip with {hostName} is coming up on {date}",
      },
      {
        type: "reservation_confirmed",
        title: "Reservation confirmed",
        message: "Your boat trip with {hostName} is confirmed for {date}",
      },
      {
        type: "reservation_received",
        title: "New reservation",
        message: "{guestName} reserved your boat for {date}",
      },
      {
        type: "payout_sent",
        title: "Payout sent",
        message: "${amount} has been sent to your {method}",
      },
      {
        type: "new_message",
        title: "New message",
        message: "{senderName} sent you a message",
      },
    ],
  });
}
