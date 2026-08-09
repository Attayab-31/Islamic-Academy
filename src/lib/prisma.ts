import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "./database";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const resolvedDatabaseUrl = getDatabaseUrl();
process.env.DATABASE_URL = resolvedDatabaseUrl;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
