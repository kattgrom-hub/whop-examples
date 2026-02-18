"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

function BookingMessageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const hostId = params.get("hostId") || "";
  const boatTitle = params.get("boatTitle") || "Boat Trip";
  const date = params.get("date") || "";

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsSending(true);
    setError(null);

    try {
      const res = await fetch("/api/chat/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostCompanyId: hostId,
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      router.push("/reservations");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSending(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 spinner-airbnb rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2 text-[#222222]">Sign in required</h1>
          <p className="text-[#717171] mb-6">You need to be logged in to continue.</p>
          <Link
            href="/auth/login?redirect=/browse"
            className="px-6 py-3 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] transition-colors font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = date
    ? new Date(date + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-6 py-12">
        {/* Success header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#222222] mb-2">Booking confirmed!</h1>
          <p className="text-[#717171]">
            {boatTitle}
            {formattedDate && <> &middot; {formattedDate}</>}
          </p>
        </div>

        {/* Message prompt */}
        <div className="border border-[#DDDDDD] rounded-xl p-6">
          <h2 className="font-semibold text-[#222222] mb-1">
            Send a message to your host
          </h2>
          <p className="text-sm text-[#717171] mb-3">
            Introduce yourself and let them know anything they should prepare for your trip.
          </p>

          {/* Quick-fill suggestions */}
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              `Hi! I just booked ${boatTitle}. Can't wait!`,
              `Hey! Excited for ${boatTitle}${formattedDate ? ` on ${formattedDate}` : ""}. Anything I should bring?`,
              `Hello! Looking forward to the trip. How early should we arrive?`,
              `Hi there! We're a group of friends celebrating a birthday — any special requests we can make?`,
              `Hey! First time on this type of boat. Any tips for a newbie?`,
              `Hi! Will there be shade on board? Want to make sure we pack sunscreen either way.`,
            ].map((suggestion, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMessage(suggestion)}
                className="px-3 py-1.5 text-xs bg-[#F7F7F7] border border-[#DDDDDD] rounded-full text-[#222222] hover:bg-[#EBEBEB] transition-colors text-left"
              >
                {suggestion.length > 50 ? suggestion.slice(0, 50) + "..." : suggestion}
              </button>
            ))}
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message to your host..."
            rows={4}
            className="w-full px-4 py-3 border border-[#DDDDDD] rounded-lg text-[#222222] placeholder-[#B0B0B0] focus:outline-none focus:border-[#222222] resize-none text-sm"
          />

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}

          <button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            className="w-full mt-4 py-3 bg-[#222222] text-white rounded-lg hover:bg-[#000000] transition-colors font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              "Send message"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingMessagePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 spinner-airbnb rounded-full animate-spin" />
        </div>
      }
    >
      <BookingMessageContent />
    </Suspense>
  );
}
