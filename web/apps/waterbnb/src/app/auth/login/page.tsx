"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleWhopLogin = () => {
    signIn("whop", { callbackUrl: redirect });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl p-8 border border-[#DDDDDD] shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2 text-[#222222]">Welcome to Waterbnb</h1>
            <p className="text-[#717171]">Sign in to reserve boats or manage your listings</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleWhopLogin}
              className="w-full py-4 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] transition-colors font-semibold flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
              Continue with Whop
            </button>
          </div>

          <p className="text-center text-[#717171] text-sm mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 spinner-airbnb rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
