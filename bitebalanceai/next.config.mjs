/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Ensure Prisma and native modules work in serverless / edge environments
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs", "pg"],
  },
};

export default nextConfig;
