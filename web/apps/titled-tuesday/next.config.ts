import type { NextConfig } from "next";

// Rebuild trigger: sandbox env vars (WHOP_BASE_URL, WHOP_API_KEY, NEXT_PUBLIC_WHOP_ENVIRONMENT)
const nextConfig: NextConfig = {
  // Skip typecheck in preview builds for speed (CI handles it)
  typescript: {
    ignoreBuildErrors: process.env.VERCEL_ENV === "preview",
  },
  eslint: {
    ignoreDuringBuilds: process.env.VERCEL_ENV === "preview",
  },
};

export default nextConfig;
