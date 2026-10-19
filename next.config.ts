import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  webpack: (config, { dev }) => {
    // Avoid massive Webpack PackFileCache disk serialization that causes ArrayBuffer allocation crashes on Windows
    if (dev) {
      config.cache = {
        type: 'memory',
      };
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      crypto: false,
      path: false,
    };
    return config;
  },
};

export default nextConfig;
