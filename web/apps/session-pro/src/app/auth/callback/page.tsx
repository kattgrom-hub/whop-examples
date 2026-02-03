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
      // Prevent double execution in React Strict Mode
      if (hasProcessed.current) return;

      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      // Handle OAuth error from provider
      if (errorParam) {
        setError(errorDescription || errorParam);
        setIsProcessing(false);
        return;
      }

      // No code yet - might still be loading
      if (!code) {
        // Give it a moment for params to populate
        setTimeout(() => {
          if (!searchParams.get("code") && !searchParams.get("error")) {
            setError("No authorization code received");
            setIsProcessing(false);
          }
        }, 1000);
        return;
      }

      try {
        // Mark as processed to prevent Strict Mode double execution
        hasProcessed.current = true;

        // Exchange code for tokens
        const tokens = await exchangeCodeForTokens(code);

        // Get user info
        const user = await getUserInfo(tokens.access_token);

        // Store in auth context
        login(tokens, user);

        // Parse redirect from state
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

        // Redirect to destination
        router.push(redirect);
      } catch (err) {
        console.error("OAuth callback error:", err);
        setError(err instanceof Error ? err.message : "Authentication failed");
        setIsProcessing(false);
      }
    }

    handleCallback();
  }, [searchParams, login, router]);

  // Always show loading spinner while processing
  if (isProcessing && !error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold mb-2">Signing you in...</h1>
          <p className="text-gray-400">Please wait while we complete authentication</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-xl font-semibold mb-2 text-red-400">Authentication Failed</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <a
            href="/auth/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold mb-2">Signing you in...</h1>
        <p className="text-gray-400">Please wait while we complete authentication</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
