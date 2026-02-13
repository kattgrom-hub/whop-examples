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
    description: "Everything you need to start selling picks",
    features: [
      "Unlimited pick packages",
      "Set your own prices",
      "Built-in payments",
      "Subscriber management",
    ],
  },
  pro: {
    name: "Pro",
    price: 19,
    fee: 5,
    description: "Lower fees for high-volume tipsters",
    features: [
      "Everything in Core",
      "Lower 5% platform fee",
      "Priority support",
      "Advanced analytics",
    ],
  },
} as const;

export default function BecomeATipsterPage() {
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
    <div className="min-h-screen bg-[#0A0A0A] py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Start Selling Picks Today</h1>
          <p className="text-gray-400">Choose the plan that works for you</p>
        </div>

        {/* Plan Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {(Object.entries(PLANS) as [PlanTier, typeof PLANS.core][]).map(([key, plan]) => (
            <button
              key={key}
              onClick={() => setSelectedPlan(key)}
              className={`text-left p-6 rounded-2xl border-2 transition-all ${
                selectedPlan === key
                  ? "border-[#F59E0B] bg-[#F59E0B]/10"
                  : "border-[#2A2A2A] bg-[#111111] hover:border-[#3A3A3A]"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-white">{plan.name}</span>
                {selectedPlan === key && (
                  <span className="w-5 h-5 rounded-full bg-[#F59E0B] flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#0A0A0A]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-white">${plan.price}</span>
                <span className="text-gray-400">/month</span>
                <span className="text-gray-500 mx-1">+</span>
                <span className="text-xl font-bold text-white">{plan.fee}%</span>
                <span className="text-gray-400">fee</span>
              </div>

              <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-[#F59E0B]">&#10003;</span> {feature}
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
            className="px-8 py-3 bg-[#F59E0B] text-[#0A0A0A] rounded-lg hover:bg-[#D97706] transition-colors font-bold"
          >
            {selectedPlan === "core" ? "Get Started Free" : "Start with Pro — $19/mo"}
          </button>
          <p className="text-gray-500 text-sm mt-4">
            {selectedPlan === "core"
              ? "No credit card required"
              : "Cancel anytime"}
          </p>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
          <div className="bg-[#111111] rounded-2xl border border-[#2A2A2A] max-w-md w-full p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">
              {selectedPlan === "core" ? "Welcome!" : "Upgrade to Pro"}
            </h2>
            <p className="text-gray-400 mb-2">
              {selectedPlan === "core"
                ? "Sign in with Whop to set up your profile and start earning."
                : "Sign in with Whop, then complete your Pro subscription."}
            </p>
            <div className="bg-[#1A1A1A] rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-white">
                <span className="font-semibold">{PLANS[selectedPlan].name}</span>
                <span className="text-gray-400">•</span>
                <span>${PLANS[selectedPlan].price}/mo + {PLANS[selectedPlan].fee}% fee</span>
              </div>
            </div>
            <button
              onClick={handleContinue}
              className="w-full py-3 bg-[#F59E0B] text-[#0A0A0A] rounded-lg hover:bg-[#D97706] transition-colors font-bold mb-3"
            >
              Continue with Whop
            </button>
            <button
              onClick={() => setShowWelcome(false)}
              className="text-gray-500 hover:text-white text-sm"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
