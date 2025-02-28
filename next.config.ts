import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: './src/empty-module.ts',
      },
    },
  },
};

export default nextConfig;