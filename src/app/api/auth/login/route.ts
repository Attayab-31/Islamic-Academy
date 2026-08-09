import { NextResponse } from "next/server";
import {
  authenticateUser,
  authRedirectPath,
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth";
import { loginSchema } from "@/lib/auth-schemas";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`login:${ip}`, 10, 1000 * 60 * 15);
    if (!limit.success) {
      return NextResponse.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const user = await authenticateUser(parsed.data.email, parsed.data.password);
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await createSessionToken(user);
    const response = NextResponse.json({
      ok: true,
      role: user.role,
      redirectTo: authRedirectPath(user.role),
    });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("Login failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
