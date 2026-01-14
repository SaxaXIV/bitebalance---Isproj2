import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure Prisma works in serverless / edge environments
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
