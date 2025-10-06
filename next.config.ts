import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ultra-minimal config for maximum speed
  compress: false,
  generateEtags: false,
  poweredByHeader: false,
};

export default nextConfig;
