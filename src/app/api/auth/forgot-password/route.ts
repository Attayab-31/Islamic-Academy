import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { createPasswordResetToken } from "@/lib/auth";
import { forgotPasswordSchema } from "@/lib/auth-schemas";
import { sendPasswordResetEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`forgot:${ip}`, 5, 1000 * 60 * 60);
    if (!limit.success) {
      return NextResponse.json({ error: "Too many reset requests. Try again later." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const email = parsed.data.email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && [UserRole.ADMIN, UserRole.PARENT, UserRole.TEACHER].includes(user.role)) {
      const token = await createPasswordResetToken(user.id);
      try {
        await sendPasswordResetEmail(user.email, token);
      } catch (emailError) {
        console.error("Password reset email failed:", emailError);
        if (process.env.NODE_ENV === "production") {
          return NextResponse.json({ error: "Unable to send reset email right now." }, { status: 503 });
        }
      }
    }

    return NextResponse.json({
      ok: true,
      message: "If an account exists for that email, a reset link has been sent.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to process reset request." }, { status: 500 });
  }
}
