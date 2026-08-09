import { NextResponse } from "next/server";
import { createSessionToken, resetPasswordWithToken, setSessionCookie } from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/auth-schemas";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`reset:${ip}`, 10, 1000 * 60 * 60);
    if (!limit.success) {
      return NextResponse.json({ error: "Too many reset attempts. Try again later." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    let user;
    try {
      user = await resetPasswordWithToken(parsed.data.token, parsed.data.password);
    } catch (error) {
      if (error instanceof Error && error.message === "INVALID_TOKEN") {
        return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
      }
      throw error;
    }

    const token = await createSessionToken(user);
    const response = NextResponse.json({ ok: true, redirectTo: "/portal" });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Password reset failed." }, { status: 500 });
  }
}
