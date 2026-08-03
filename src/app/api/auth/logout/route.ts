import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function GET() {
    const response = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"));
    clearSessionCookie(response);
    return response;
}

export async function POST() {
    const response = NextResponse.json({ ok: true });
    clearSessionCookie(response);
    return response;
}
