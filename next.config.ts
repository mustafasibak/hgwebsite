import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: "/logo.png" },
      { pathname: "/speisekarte.jpg" },
      { pathname: "/placeholders/**" },
      // Menu photos use ?v=mtime cache busting when files are replaced
      { pathname: "/essen/**" },
    ],
  },
};

export default nextConfig;
