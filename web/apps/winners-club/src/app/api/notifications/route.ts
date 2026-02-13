import { NextRequest, NextResponse } from "next/server";

/**
 * Notifications API
 *
 * Send notifications to users via Whop Notifications API:
 * - Session reminders ("Your session starts in 1 hour")
 * - Booking confirmations ("New booking from Jamie")
 * - Payout notifications ("$150 has been deposited")
 * - Course updates ("New lesson available")
 *
 * TODO: Integrate Whop Notifications API
 */

type NotificationType =
  | "session_reminder"
  | "booking_confirmed"
  | "booking_received"
  | "payout_sent"
  | "new_message"
  | "course_update";

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

    // TODO: Send notification via Whop API
    // await whop.notifications.send({
    //   userId,
    //   title,
    //   message,
    //   data
    // });

    console.log(`Sending notification to ${userId}:`, {
      type,
      title,
      message,
      data,
    });

    // Mock response
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

// Get notification templates
export async function GET() {
  return NextResponse.json({
    templates: [
      {
        type: "session_reminder",
        title: "Session starting soon",
        message: "Your class with {instructorName} starts in {time}",
      },
      {
        type: "booking_confirmed",
        title: "Booking confirmed",
        message: "Your class with {instructorName} is confirmed for {date}",
      },
      {
        type: "booking_received",
        title: "New booking",
        message: "{learnerName} booked a class for {date}",
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
      {
        type: "course_update",
        title: "New content available",
        message: "New lesson added to {courseName}",
      },
    ],
  });
}
