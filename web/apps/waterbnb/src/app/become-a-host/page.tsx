"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { signIn } from "next-auth/react";

type PlanTier = "core" | "pro";

const PLANS = {
  core: {
    name: "Core",
    price: 0,
    fee: 8,
    description: "Everything you need to get started",
    features: [
      "Create unlimited listings",
      "Set your own prices",
      "Built-in payments",
      "Guest management",
    ],
  },
  pro: {
    name: "Pro",
    price: 19,
    fee: 5,
    description: "Lower fees for high-volume hosts",
    features: [
      "Everything in Core",
      "Lower 5% platform fee",
      "Priority support",
      "Advanced analytics",
    ],
  },
} as const;

export default function BecomeAHostPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("core");
  const [showWelcome, setShowWelcome] = useState(false);

  const handleStart = () => {
    if (isAuthenticated) {
      if (selectedPlan === "pro") {
        router.push("/upgrade/pro");
      } else {
        router.push("/dashboard");
      }
    } else {
      setShowWelcome(true);
    }
  };

  const handleContinue = () => {
    signIn("whop", {
      callbackUrl: selectedPlan === "core" ? "/dashboard" : "/upgrade/pro",
    });
  };

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#222222] mb-4">Start Hosting Today</h1>
          <p className="text-[#717171]">Choose the plan that works for you</p>
        </div>

        {/* Plan Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {(Object.entries(PLANS) as [PlanTier, typeof PLANS.core][]).map(([key, plan]) => (
            <button
              key={key}
              onClick={() => setSelectedPlan(key)}
              className={`text-left p-6 rounded-2xl border-2 transition-all ${
                selectedPlan === key
                  ? "border-[#222222] bg-white shadow-md"
                  : "border-[#DDDDDD] bg-white hover:border-[#B0B0B0]"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-[#222222]">{plan.name}</span>
                {selectedPlan === key && (
                  <span className="w-5 h-5 rounded-full bg-[#222222] flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-[#222222]">${plan.price}</span>
                <span className="text-[#717171]">/month</span>
                <span className="text-[#B0B0B0] mx-1">+</span>
                <span className="text-xl font-bold text-[#222222]">{plan.fee}%</span>
                <span className="text-[#717171]">fee</span>
              </div>

              <p className="text-[#717171] text-sm mb-4">{plan.description}</p>

              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-[#484848]">
                    <span className="text-[#FF385C]">&#10003;</span> {feature}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={handleStart}
            className="px-8 py-3 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] transition-colors font-semibold"
          >
            {selectedPlan === "core" ? "Get Started Free" : "Start with Pro — $15/mo"}
          </button>
          <p className="text-[#717171] text-sm mt-4">
            {selectedPlan === "core"
              ? "No credit card required"
              : "Cancel anytime"}
          </p>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-[#717171] hover:text-[#222222] transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl border border-[#DDDDDD] max-w-md w-full p-8 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-[#222222] mb-3">
              {selectedPlan === "core" ? "Welcome!" : "Upgrade to Pro"}
            </h2>
            <p className="text-[#717171] mb-2">
              {selectedPlan === "core"
                ? "Sign in with Whop to set up your profile and start earning."
                : "Sign in with Whop, then complete your Pro subscription."}
            </p>
            <div className="bg-[#F7F7F7] rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-[#222222]">
                <span className="font-semibold">{PLANS[selectedPlan].name}</span>
                <span className="text-[#717171]">•</span>
                <span>${PLANS[selectedPlan].price}/mo + {PLANS[selectedPlan].fee}% fee</span>
              </div>
            </div>
            <button
              onClick={handleContinue}
              className="w-full py-3 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] transition-colors font-semibold mb-3"
            >
              Continue with Whop
            </button>
            <button
              onClick={() => setShowWelcome(false)}
              className="text-[#717171] hover:text-[#222222] text-sm"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
