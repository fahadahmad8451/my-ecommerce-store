import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allows isolated verification builds without colliding with a running local dev server.
  distDir: process.env.NEXT_DIST_DIR || ".next"
};

export default nextConfig;
