import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build a fully static site (HTML/CSS/JS) into `out/` for static hosting.
  output: "export",
  // Static export has no image optimization server, so serve images as-is.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
