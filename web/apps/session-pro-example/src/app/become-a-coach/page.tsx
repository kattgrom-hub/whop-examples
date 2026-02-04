"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { startOAuth } from "@/lib/auth";

export default function BecomeACoachPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  const handleStart = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      setShowWelcome(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Start Coaching Today</h1>
        <p className="text-gray-400 mb-8">Create sessions, set your price, and start earning. No monthly fees—just 8% of what you earn.</p>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8 mb-8">
          <div className="flex items-baseline justify-center gap-2 mb-6">
            <span className="text-4xl font-bold text-white">$0</span>
            <span className="text-gray-400">/month</span>
            <span className="text-gray-500 mx-2">+</span>
            <span className="text-2xl font-bold text-white">8%</span>
            <span className="text-gray-400">of earnings</span>
          </div>

          <ul className="text-left space-y-3 mb-8">
            {["Create unlimited sessions", "Set your own prices", "Built-in payments", "Student management"].map((f) => (
              <li key={f} className="flex items-center gap-3 text-gray-300">
                <span className="text-blue-400">✓</span> {f}
              </li>
            ))}
          </ul>

          <button onClick={handleStart} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Get Started Free
          </button>
        </div>

        <Link href="/" className="text-gray-400 hover:text-white transition-colors">← Back to home</Link>
      </div>

      {showWelcome && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-md w-full p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Welcome!</h2>
            <p className="text-gray-400 mb-6">Sign in to set up your profile and start earning.</p>
            <button onClick={() => startOAuth("/dashboard")} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium mb-3">
              Continue
            </button>
            <button onClick={() => setShowWelcome(false)} className="text-gray-500 hover:text-white text-sm">Maybe later</button>
          </div>
        </div>
      )}
    </div>
  );
}
