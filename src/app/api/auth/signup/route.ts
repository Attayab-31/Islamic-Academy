import { NextResponse } from "next/server";
import {
  createParentUser,
  createSessionToken,
  setSessionCookie,
  authRedirectPath,
} from "@/lib/auth";
import { signupSchema } from "@/lib/auth-schemas";
import { sendWelcomeEmail } from "@/lib/email";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`signup:${ip}`, 5, 1000 * 60 * 60);
    if (!limit.success) {
      return NextResponse.json({ error: "Too many signup attempts. Try again later." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    let user;
    try {
      user = await createParentUser(parsed.data);
    } catch (error) {
      if (error instanceof Error && error.message === "EMAIL_EXISTS") {
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
      }
      throw error;
    }

    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error("Welcome email failed:", emailError);
    }

    const token = await createSessionToken(user);
    const response = NextResponse.json({
      ok: true,
      redirectTo: authRedirectPath(user.role),
    });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Signup failed." }, { status: 500 });
  }
}
