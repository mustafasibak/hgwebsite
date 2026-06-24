import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      // Menu photos use ?v=mtime cache busting when files are replaced
      { pathname: "/essen/**" },
    ],
  },
};

export default nextConfig;
