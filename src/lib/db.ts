import Database from "better-sqlite3";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Resolve the SQLite file. On Vercel the only writable path is /tmp, so the
// demo DB is recreated there per cold start; locally it lives in prisma/dev.db.
function resolveDbPath(): string {
  if (process.env.VERCEL) return "/tmp/travelopedia.db";
  const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  return url.replace(/^file:/, "");
}

const DB_PATH = resolveDbPath();
const DB_URL = `file:${DB_PATH}`;

// Idempotent schema bootstrap so the app works even when migrations haven't
// been run (e.g. a fresh /tmp database on a serverless cold start).
const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS "Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reference" TEXT NOT NULL,
    "tourSlug" TEXT NOT NULL,
    "tourTitle" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "departure" TEXT NOT NULL,
    "travelers" INTEGER NOT NULL,
    "addOns" TEXT NOT NULL,
    "baseTotal" INTEGER NOT NULL,
    "addOnsTotal" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookingId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "method" TEXT NOT NULL DEFAULT 'UPI',
    "upiId" TEXT NOT NULL,
    "upiApp" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'success',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Booking_reference_key" ON "Booking"("reference");
`;

function ensureSchema(): void {
  const db = new Database(DB_PATH);
  try {
    db.exec(SCHEMA_SQL);
  } finally {
    db.close();
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  ensureSchema();
  const adapter = new PrismaBetterSqlite3({ url: DB_URL });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
