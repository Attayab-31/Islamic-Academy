import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import { getSiteUrl } from "@/lib/utils";

export async function GET() {
  const response = NextResponse.redirect(new URL("/login", getSiteUrl()));
  clearSessionCookie(response);
  return response;
}

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}
