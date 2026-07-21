import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly sets the project root to silence multi-lockfile workspace warnings
    root: path.join(__dirname),
  },
};

export default nextConfig;