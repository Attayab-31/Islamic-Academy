import { PrismaClient } from "@prisma/client";
import { getDatabaseUrl } from "./database";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

const resolvedDatabaseUrl = getDatabaseUrl();
process.env.DATABASE_URL = resolvedDatabaseUrl;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: resolvedDatabaseUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

globalForPrisma.prisma = prisma;
