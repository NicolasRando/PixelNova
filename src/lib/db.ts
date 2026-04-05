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

  // Verifier si la table User a la colonne emailVerified (V3)
  // Si non, on supprime et recree toutes les tables
  try {
    const cols = await client.execute(
      `PRAGMA table_info("User")`
    );
    const hasEmailVerified = cols.rows.some(
      (row) => (row as Record<string, unknown>).name === "emailVerified"
    );

    if (cols.rows.length > 0 && !hasEmailVerified) {
      // Schema V2 detecte, migration vers V3
      await client.execute(`DROP TABLE IF EXISTS "Account"`);
      await client.execute(`DROP TABLE IF EXISTS "VerificationToken"`);
      await client.execute(`DROP TABLE IF EXISTS "Check"`);
      await client.execute(`DROP TABLE IF EXISTS "Service"`);
      await client.execute(`DROP TABLE IF EXISTS "User"`);
    }
  } catch {
    // Table n'existe pas encore, on continue
  }

  // Table User (V3 : emailVerified, image, password nullable)
  await client.execute(`CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "emailVerified" DATETIME,
    "image" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);

  // Table Account (Auth.js v5 - OAuth)
  await client.execute(`CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`);

  // Index unique sur Account (provider, providerAccountId)
  await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account" ("provider", "providerAccountId")`);

  // Table VerificationToken (Auth.js v5)
  await client.execute(`CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "expires" DATETIME NOT NULL
  )`);

  await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken" ("identifier", "token")`);

  // Table Service
  await client.execute(`CREATE TABLE IF NOT EXISTS "Service" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 5,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Service_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
  )`);

  // Table Check
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
