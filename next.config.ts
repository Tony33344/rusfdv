import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  // Fix for Netlify deployment
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Exclude API routes from static export
  excludeDefaultMomentLocales: true,
};

export default nextConfig;
