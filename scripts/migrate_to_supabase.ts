import "dotenv/config";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { Client } from "pg";
import { execSync } from "node:child_process";

const localDatabaseUrl = process.env.LOCAL_DATABASE_URL ?? "file:./dev.db";
const remoteDatabaseUrl = process.env.DATABASE_URL;

if (!remoteDatabaseUrl) {
    throw new Error("DATABASE_URL must be set to your Supabase PostgreSQL URL.");
}

function resolveLocalDbPath(): string {
    const rawPath = localDatabaseUrl.replace(/^file:/, "").replace(/^\.\//, "");
    return join(process.cwd(), rawPath);
}

function ensureLocalDbExists() {
    const resolvedPath = resolveLocalDbPath();
    if (!existsSync(resolvedPath)) {
        throw new Error(`Local database file was not found at ${resolvedPath}.`);
    }
}

function runPython(command: string, args: string[]) {
    const pythonCandidates = ["python3", "python", "py"];
    for (const candidate of pythonCandidates) {
        const result = spawnSync(candidate, args, { encoding: "utf8" });
        if (result.status === 0) {
            return result.stdout;
        }
    }
    throw new Error("Could not find a Python interpreter to read the local SQLite database.");
}

function readSqliteRows() {
    const dbPath = resolveLocalDbPath();
    const pythonScript = `
import json
import sqlite3
import sys

conn = sqlite3.connect(sys.argv[1])
conn.row_factory = sqlite3.Row
cur = conn.cursor()
rows = []
for table in ["User", "PasswordResetToken", "Teacher", "AvailabilitySlot", "Booking", "BookingAuditEvent", "Enrollment", "Lead"]:
    cur.execute(f'SELECT * FROM "{table}"')
    rows.append({"table": table, "rows": [dict(r) for r in cur.fetchall()]})
print(json.dumps(rows))
`;
    const output = runPython("python", ["-c", pythonScript, dbPath]);
    return JSON.parse(output) as Array<{ table: string; rows: Array<Record<string, unknown>> }>;
}

async function main() {
    ensureLocalDbExists();

    console.log("Generating Prisma client for the current schema...");
    execSync("npx prisma generate", { stdio: "inherit" });

    console.log("Pushing schema to Supabase...");
    execSync("npx prisma db push", { stdio: "inherit", env: { ...process.env, DATABASE_URL: remoteDatabaseUrl } });

    const client = new Client({
        connectionString: remoteDatabaseUrl,
        ssl: { rejectUnauthorized: false },
    });

    await client.connect();

    try {
        const rowsByTable = readSqliteRows();
        const tableDefinitions: Record<string, { conflictTarget: string; columns: string[] }> = {
            User: { conflictTarget: "email", columns: ["id", "email", "passwordHash", "name", "role", "emailVerified", "createdAt", "updatedAt"] },
            PasswordResetToken: { conflictTarget: "tokenHash", columns: ["id", "tokenHash", "userId", "expiresAt", "usedAt", "createdAt"] },
            Teacher: { conflictTarget: "slug", columns: ["id", "slug", "name", "gender", "languages", "specializations", "email", "timezone", "zoomUserId", "userId", "createdAt"] },
            AvailabilitySlot: { conflictTarget: "id", columns: ["id", "teacherId", "dayOfWeek", "startHour", "startMin", "duration", "capacity", "timezone"] },
            Booking: { conflictTarget: "reference", columns: ["id", "reference", "courseSlug", "programSlug", "teacherId", "userId", "learnerName", "learnerAge", "level", "language", "teacherGender", "contactName", "contactEmail", "contactPhone", "country", "timezone", "slotStart", "slotEnd", "zoomLink", "status", "whatsappOptIn", "reminderSentAt", "createdAt"] },
            BookingAuditEvent: { conflictTarget: "id", columns: ["id", "bookingId", "actorUserId", "eventType", "previousStatus", "newStatus", "details", "createdAt"] },
            Enrollment: { conflictTarget: "id", columns: ["id", "userId", "fullName", "email", "phone", "country", "courseSlug", "planName", "amount", "currency", "paymentMethod", "paymentReference", "paymentStatus", "accessStatus", "activatedAt", "expiresAt", "teacherId", "monthlyBlockStartAt", "monthlyBlockEndAt", "transferBank", "transferAccountName", "transferAccountNumber", "adminNotes", "createdAt", "updatedAt"] },
            Lead: { conflictTarget: "id", columns: ["id", "email", "source", "createdAt"] },
        };

        for (const { table, rows } of rowsByTable) {
            const definition = tableDefinitions[table];
            if (!definition) {
                continue;
            }

            for (const row of rows) {
                const columnNames = definition.columns.filter((column) => column in row);
                const placeholders = columnNames.map((_, idx) => `$${idx + 1}`).join(", ");
                const values = columnNames.map((column) => row[column]);
                const upsertQuery = `
          INSERT INTO ${table} (${columnNames.join(", ")})
          VALUES (${placeholders})
          ON CONFLICT (${definition.conflictTarget}) DO UPDATE SET ${columnNames
                        .filter((column) => column !== definition.conflictTarget)
                        .map((column) => `${column} = EXCLUDED.${column}`)
                        .join(", ")}
        `;
                await client.query(upsertQuery, values);
            }
        }

        console.log("Migration complete.");
    } finally {
        await client.end();
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
