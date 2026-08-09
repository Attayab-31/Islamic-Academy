import "dotenv/config";

function normalizeSupabaseUrl(rawUrl: string): string {
    const trimmed = rawUrl.trim();

    if (!trimmed) {
        return trimmed;
    }

    if (trimmed.includes("supabase.com") && !trimmed.includes("sslmode=")) {
        return trimmed.includes("?") ? `${trimmed}&sslmode=require` : `${trimmed}?sslmode=require`;
    }

    return trimmed;
}

export function getDatabaseUrl(): string {
    const databaseUrl = process.env.DATABASE_URL?.trim();
    if (databaseUrl) {
        return normalizeSupabaseUrl(databaseUrl);
    }

    if (process.env.NODE_ENV === "production") {
        throw new Error("DATABASE_URL must be configured for production deployments.");
    }

    const localDatabaseUrl = process.env.LOCAL_DATABASE_URL?.trim();
    if (localDatabaseUrl) {
        return localDatabaseUrl;
    }

    throw new Error("DATABASE_URL is not set. Configure your Supabase PostgreSQL connection string in the environment.");
}
