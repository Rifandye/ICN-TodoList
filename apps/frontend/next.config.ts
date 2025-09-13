import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["api.minio.runeforge.tech", "vercel.com"],
  },
};

export default nextConfig;
