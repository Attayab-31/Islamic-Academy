import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ ok: true, service: "islamic-academy", mode: "direct_transfer" });
}
