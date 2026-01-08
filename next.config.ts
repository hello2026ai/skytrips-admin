import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
