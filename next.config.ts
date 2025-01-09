import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["github.com", "raw.githubusercontent.com"],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    // Add other environment variables here as needed
  },
};

export default nextConfig;
