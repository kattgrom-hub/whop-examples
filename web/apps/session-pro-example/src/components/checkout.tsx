"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EmbeddedCheckoutProps {
  planId: string;
  onSuccess?: () => void;
  onClose?: () => void;
  redirectUrl?: string;
}

/**
 * Mock Embedded Checkout Component
 *
 * In production, this would render a real payment form.
 * This demo version shows a mock checkout UI that simulates the payment flow.
 */
export function EmbeddedCheckout({
  planId,
  onSuccess,
  onClose,
  redirectUrl,
}: EmbeddedCheckoutProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  console.log("🛒 Demo checkout - Plan ID:", planId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    console.log("💳 [Demo] Processing payment...");

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("✅ [Demo] Payment successful!");

    setIsProcessing(false);
    onSuccess?.();

    if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
      {/* Demo Mode Banner */}
      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 text-purple-300">
          <span className="text-xl">🎭</span>
          <span className="font-medium">Demo Mode</span>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          This is a demo checkout. In production, this would be a secure payment form.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Card Number
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
            placeholder="4242 4242 4242 4242"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            disabled={isProcessing}
          />
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                if (val.length >= 2) val = val.slice(0, 2) + "/" + val.slice(2);
                setExpiry(val);
              }}
              placeholder="MM/YY"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              disabled={isProcessing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CVC
            </label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="123"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <span>💳</span>
              Pay Now (Demo)
            </>
          )}
        </button>

        {/* Cancel Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full py-3 bg-gray-700 text-gray-300 font-medium rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Info Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          🔒 In production, this handles PCI-compliant payment processing securely.
        </p>
      </div>
    </div>
  );
}
