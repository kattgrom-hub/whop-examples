"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WhopEmbeddedCheckout } from "@/components/whop-checkout";

interface CoachBookingProps {
  coachId: string;
  coachName: string;
  hourlyRate: number;
}

const TIME_SLOTS = [
  { label: "Mon 10am", value: "monday-10am" },
  { label: "Mon 2pm", value: "monday-2pm" },
  { label: "Tue 11am", value: "tuesday-11am" },
  { label: "Wed 3pm", value: "wednesday-3pm" },
  { label: "Thu 10am", value: "thursday-10am" },
  { label: "Fri 1pm", value: "friday-1pm" },
];

export function CoachBookingSection({
  coachId,
  coachName,
  hourlyRate,
}: CoachBookingProps) {
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [planId, setPlanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartCheckout = async () => {
    if (!selectedSlot) {
      setError("Please select a time slot");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coachId,
          coachName,
          price: hourlyRate,
          timeSlot: selectedSlot,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      // Set plan ID to show embedded checkout
      setPlanId(data.planId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckoutSuccess = () => {
    // Redirect to success page
    router.push(`/dashboard/sessions?success=true&coach=${coachId}`);
  };

  const handleCloseCheckout = () => {
    setPlanId(null);
  };

  // Show embedded checkout if we have a plan ID
  if (planId) {
    return (
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--gray-12)' }}>Complete Your Booking</h2>
            <p className="text-sm" style={{ color: 'var(--gray-11)' }}>
              Session with {coachName} • {TIME_SLOTS.find(s => s.value === selectedSlot)?.label}
            </p>
          </div>
          <button
            onClick={handleCloseCheckout}
            className="p-2 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: 'var(--gray-11)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>
        <div className="rounded-xl overflow-hidden border border-white/10">
          <WhopEmbeddedCheckout
            planId={planId}
            onSuccess={handleCheckoutSuccess}
            onClose={handleCloseCheckout}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Book a Session</h2>
      <p className="text-gray-400 mb-6">
        Select a time slot and book your 1:1 session with {coachName}.
      </p>

      {/* Time slots */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {TIME_SLOTS.map((slot) => (
          <button
            key={slot.value}
            onClick={() => {
              setSelectedSlot(slot.value);
              setError(null);
            }}
            className={`px-4 py-3 rounded-lg transition-colors text-sm ${
              selectedSlot === slot.value
                ? "bg-blue-600 text-white"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {slot.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleStartCheckout}
        disabled={isLoading || !selectedSlot}
        className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Loading checkout...
          </span>
        ) : (
          `Book for $${hourlyRate}`
        )}
      </button>

      <p className="text-gray-500 text-sm text-center mt-3">
        Secure payment powered by Whop
      </p>
    </div>
  );
}
