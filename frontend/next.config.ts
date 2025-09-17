import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure dynamic routes work properly on Vercel
  trailingSlash: false,
  
  // Disable experimental features that might cause issues
  experimental: {},
  
  // Ensure TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Standard configuration for Vercel
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
