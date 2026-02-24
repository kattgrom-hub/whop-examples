import type { NextConfig } from "next";

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
