import { defineConfig } from "prisma/config";

// Prisma 7 reads the datasource URL from here (no longer from schema.prisma).
// SQLite file lives in prisma/dev.db for the local/demo app.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  },
});
