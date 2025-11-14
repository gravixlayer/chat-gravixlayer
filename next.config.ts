import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ultra-minimal config for maximum speed
  compress: false,
  generateEtags: false,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
    ],
  },
};

export default nextConfig;
