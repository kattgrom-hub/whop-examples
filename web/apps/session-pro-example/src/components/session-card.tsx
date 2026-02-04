"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmbeddedCheckout } from "@/components/checkout";

interface Session {
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

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function SessionCard({ session }: { session: Session }) {
  const router = useRouter();
  const [planId, setPlanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBook = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coachId: session.coachId,
          coachName: session.coachName,
          price: session.price,
          timeSlot: `${session.date} ${session.time}`,
          sessionId: session.id,
          sessionTitle: session.title,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      setPlanId(data.planId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckoutSuccess = () => {
    router.push(`/dashboard/sessions?success=true`);
  };

  const handleCloseCheckout = () => {
    setPlanId(null);
  };

  return (
    <>
      {/* Checkout Modal */}
      {planId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
              <div>
                <h3 className="font-semibold">{session.title}</h3>
                <p className="text-sm text-gray-400">
                  {formatDate(session.date)} at {formatTime(session.time)} · ${session.price}
                </p>
              </div>
              <button
                onClick={handleCloseCheckout}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 5l10 10M15 5l-10 10" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <EmbeddedCheckout
                planId={planId}
                onSuccess={handleCheckoutSuccess}
                onClose={handleCloseCheckout}
              />
            </div>
          </div>
        </div>
      )}

      {/* Session Card */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={session.coachAvatar}
              alt={session.coachName}
              className="w-10 h-10 rounded-full bg-gray-700"
            />
            <span className="text-sm text-gray-400">{session.coachName}</span>
          </div>
          <span className="text-xl font-bold text-green-400">
            {session.price === 0 ? "Free" : `$${session.price}`}
          </span>
        </div>

        <h3 className="font-semibold text-lg mb-2">{session.title}</h3>

        {session.description && (
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {session.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="2" width="12" height="11" rx="2" />
              <path d="M1 5h12M4 1v2M10 1v2" />
            </svg>
            {formatDate(session.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="7" cy="7" r="6" />
              <path d="M7 4v3l2 2" />
            </svg>
            {formatTime(session.time)}
          </span>
          <span>{session.duration} min</span>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleBook}
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Loading...
            </>
          ) : (
            "Book Now"
          )}
        </button>
      </div>
    </>
  );
}
