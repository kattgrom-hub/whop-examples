"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useAuth } from "@/lib/auth-context";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const { isAuthenticated } = useAuth();

  const handleWhopLogin = () => {
    signIn("whop", { callbackUrl: redirect });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md animate-scale-in">
        <div className="hero-glow relative">
          <div className="relative z-10 card p-8">
            <div className="text-center mb-8">
              <p className="text-text-tertiary text-sm uppercase tracking-wider mb-2">Welcome to</p>
              <div className="flex items-baseline justify-center gap-1 mb-3">
                <span className="font-display font-bold text-amber-400 text-3xl tracking-tight">Titled</span>
                <span className="font-display italic text-text-primary text-2xl tracking-tight">Tuesday</span>
              </div>
              <p className="text-text-secondary">Sign in to enter chess tournaments or organize your own</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleWhopLogin}
                className="w-full py-4 bg-amber-600 text-text-inverse rounded-xl hover:bg-amber-500 transition-all duration-200 font-semibold flex items-center justify-center gap-3 hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
                Continue with Whop
              </button>
            </div>

            <p className="text-center text-text-tertiary text-sm mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {!isAuthenticated && (
          <p className="text-center text-text-secondary mt-6">
            Want to organize chess events?{" "}
            <Link href="/become-organizer" className="text-amber-500 hover:text-amber-400 transition-colors">
              Become an Organizer
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="spinner-lg" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
