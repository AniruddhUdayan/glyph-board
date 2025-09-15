import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: require('path').join(__dirname, '../../'),
  transpilePackages: ['@repo/ui', '@repo/common'],
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
