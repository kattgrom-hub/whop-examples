"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { startWhopOAuth } from "@/lib/whop-oauth";

export default function BecomeOrganizerPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    if (!user) return;
    setUpgrading(true);
    setError(null);

    try {
      let res = await fetch(`/api/connected-account?userId=${user.id}`);
      if (res.status === 404) {
        res = await fetch("/api/connected-account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            email: user.email,
            name: user.name || user.username,
            role: "organizer",
          }),
        });
      } else if (res.ok) {
        await fetch("/api/connected-account", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, role: "organizer" }),
        });
      }

      router.push("/dashboard/tournaments");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upgrade account");
    } finally {
      setUpgrading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="spinner-lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 animate-fade-up">
      <div className="text-center mb-12">
        <h1 className="font-display italic text-4xl md:text-5xl mb-4 text-text-primary">Become an Organizer</h1>
        <p className="text-xl text-text-secondary leading-relaxed">
          Create and manage chess tournaments. Set entry fees, define prize structures, and earn revenue.
        </p>
      </div>

      <div className="card p-8">
        <h2 className="text-xl font-semibold mb-6 text-text-primary">What you get</h2>
        <ul className="space-y-4 mb-8">
          {[
            "Create unlimited chess tournaments",
            "Set custom entry fees and prize structures",
            "Manage registrations and record results",
            "Earn revenue from your tournaments",
            "Request payouts and withdraw to your bank",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="text-amber-500 mt-0.5">&#9632;</span>
              <span className="text-text-secondary">{item}</span>
            </li>
          ))}
        </ul>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        {isAuthenticated ? (
          <button
            onClick={handleUpgrade}
            disabled={upgrading}
            className="w-full py-4 bg-amber-600 text-text-inverse rounded-xl hover:bg-amber-500 transition-all duration-200 font-semibold disabled:opacity-50 hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            {upgrading ? "Setting up..." : "Activate Organizer Account"}
          </button>
        ) : (
          <button
            onClick={() => startWhopOAuth("/become-organizer")}
            className="w-full py-4 bg-amber-600 text-text-inverse rounded-xl hover:bg-amber-500 transition-all duration-200 font-semibold hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            Sign In to Get Started
          </button>
        )}
      </div>
    </div>
  );
}
