import { NextResponse } from "next/server";
import { generateMonthlyBlockSessions } from "@/lib/monthly-blocks";

function isAuthorized(request: Request) {
    const expectedSecret = process.env.CRON_SECRET?.trim();
    if (!expectedSecret) {
        return process.env.NODE_ENV !== "production";
    }

    const headerValue = request.headers.get("x-cron-secret") ?? request.headers.get("authorization") ?? "";
    return headerValue === expectedSecret || headerValue === `Bearer ${expectedSecret}`;
}

export async function GET(request: Request) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await generateMonthlyBlockSessions();
        return NextResponse.json({ ok: true, mode: "cron" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "monthly block generation failed" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await generateMonthlyBlockSessions();
        return NextResponse.json({ ok: true, mode: "cron" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "monthly block generation failed" }, { status: 500 });
    }
}
