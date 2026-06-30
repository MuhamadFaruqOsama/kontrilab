import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: '.next-local',
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      }
    ]
  }
};

export default nextConfig;

