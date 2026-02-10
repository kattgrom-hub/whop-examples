"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useAuth } from "@/lib/auth-context";
import { exchangeCodeForTokens, getUserInfo } from "@/lib/whop-oauth";

function CallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const hasProcessed = useRef(false);

  useEffect(() => {
    async function handleCallback() {
      if (hasProcessed.current) return;

      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (errorParam) {
        setError(errorDescription || errorParam);
        setIsProcessing(false);
        return;
      }

      if (!code) {
        setTimeout(() => {
          if (!searchParams.get("code") && !searchParams.get("error")) {
            setError("No authorization code received");
            setIsProcessing(false);
          }
        }, 1000);
        return;
      }

      try {
        hasProcessed.current = true;

        const tokens = await exchangeCodeForTokens(code);
        const user = await getUserInfo(tokens.access_token);
        login(tokens, user);

        let redirect = "/dashboard";
        if (state) {
          try {
            const stateData = JSON.parse(atob(state));
            if (stateData.redirect) {
              redirect = stateData.redirect;
            }
          } catch {
            // Invalid state, use default redirect
          }
        }

        router.push(redirect);
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError(err instanceof Error ? err.message : "Authentication failed");
        setIsProcessing(false);
      }
    }

    handleCallback();
  }, [searchParams, login, router]);

  if (isProcessing && !error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="spinner-lg spinner mx-auto mb-4"></div>
          <h1 className="font-display italic text-xl text-text-primary mb-2">Signing you in...</h1>
          <p className="text-text-secondary">Please wait while we complete authentication</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-display italic text-xl text-red-400 mb-2">Authentication Failed</h1>
          <p className="text-text-secondary mb-6">{error}</p>
          <a
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-text-inverse rounded-xl hover:bg-amber-500 transition-all duration-200 font-semibold hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            Try Again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="spinner-lg spinner mx-auto mb-4"></div>
        <h1 className="font-display italic text-xl text-text-primary mb-2">Signing you in...</h1>
        <p className="text-text-secondary">Please wait while we complete authentication</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="spinner-lg spinner"></div>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
