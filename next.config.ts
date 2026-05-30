import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the native better-sqlite3 driver (and its Prisma adapter) out of the
  // bundler so the prebuilt binary loads correctly in server code.
  serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],
};

export default nextConfig;
