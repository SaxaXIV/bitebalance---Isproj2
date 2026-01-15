/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Ensure Prisma and native modules work in serverless / edge environments
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcrypt", "pg"],
  },
};

export default nextConfig;
