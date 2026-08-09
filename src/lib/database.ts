function appendQueryParam(url: string, key: string, value: string): string {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}${key}=${value}`;
}

function normalizeSupabaseUrl(rawUrl: string): string {
    const trimmed = rawUrl.trim();

    if (!trimmed) {
        return trimmed;
    }

    let url = trimmed;

    if (url.includes("supabase.com")) {
        if (!url.includes("sslmode=")) {
            url = appendQueryParam(url, "sslmode", "require");
        }

        // Supabase transaction pooler (port 6543) requires pgbouncer mode for Prisma.
        if (url.includes(":6543/") && !url.includes("pgbouncer=")) {
            url = appendQueryParam(url, "pgbouncer", "true");
        }
    }

    return url;
}

export function getDatabaseUrl(): string {
    const databaseUrl = process.env.DATABASE_URL?.trim();
    if (!databaseUrl) {
        throw new Error("DATABASE_URL is not set. Configure your Supabase PostgreSQL connection string in the environment.");
    }

    return normalizeSupabaseUrl(databaseUrl);
}
