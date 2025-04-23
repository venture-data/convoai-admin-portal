import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: './src/empty-module.ts',
      },
    },
  },
};

export default nextConfig;