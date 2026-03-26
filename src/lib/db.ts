import { PrismaClient } from "@/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
  dbInitialized: boolean;
};

function getDbConfig() {
  // Production : Turso cloud
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    return {
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    };
  }

  // Local : SQLite fichier
  const dbPath = path.join(process.cwd(), "prisma", "dev.db").replaceAll("\\", "/");
  return { url: `file:${dbPath}` };
}

async function ensureTables() {
  if (globalForPrisma.dbInitialized) return;

  const config = getDbConfig();
  const client = createClient(config);

  await client.execute(`CREATE TABLE IF NOT EXISTS "Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 5,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);

  await client.execute(`CREATE TABLE IF NOT EXISTS "Check" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "statusCode" INTEGER,
    "latency" INTEGER,
    "checkedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Check_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`);

  globalForPrisma.dbInitialized = true;
}

function createPrismaClient() {
  const config = getDbConfig();
  const adapter = new PrismaLibSql(config);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

// Ensure tables exist on first import
ensureTables();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
