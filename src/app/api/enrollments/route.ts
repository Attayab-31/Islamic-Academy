import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { requireAdmin, requireUser } from "@/lib/auth-guards";
import { prisma } from "@/lib/prisma";
import { activateEnrollmentAccess } from "@/lib/subscriptions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await getCurrentUser();
    const userId = user?.role === "parent" ? user.id : null;

    const enrollment = await prisma.$transaction(async (tx) => {
      return tx.enrollment.create({
        data: {
          userId,
          fullName: body.fullName,
          email: body.email?.trim().toLowerCase() ?? user?.email ?? "",
          phone: body.phone ?? null,
          country: body.country,
          courseSlug: body.courseSlug,
          planName: body.planName,
          amount: Number(body.amount ?? 0),
          currency: body.currency ?? "USD",
          paymentMethod: body.paymentMethod ?? "bank_transfer",
          paymentReference: body.paymentReference ?? null,
          paymentStatus: "pending_review",
          accessStatus: "inactive",
          activatedAt: null,
          expiresAt: null,
          teacherId: body.teacherId ?? null,
          monthlyBlockStartAt: body.monthlyBlockStartAt ? new Date(body.monthlyBlockStartAt) : null,
          monthlyBlockEndAt: body.monthlyBlockEndAt ? new Date(body.monthlyBlockEndAt) : null,
          transferBank: body.transferBank ?? null,
          transferAccountName: body.transferAccountName ?? null,
          transferAccountNumber: body.transferAccountNumber ?? null,
          adminNotes: body.enrollmentType === "monthly-block"
            ? `Monthly block enrollment requested. Preferred block: ${body.preferredBlock ?? "Not specified"}`
            : body.enrollmentType === "trial"
              ? "Trial class enrollment requested."
              : null,
        },
      });
    });

    return NextResponse.json({ ok: true, enrollment });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Enrollment failed" }, { status: 500 });
  }
}

export async function GET() {
  const auth = await requireUser();
  if (!auth.user) return auth.response!;

  if (auth.user.role === "admin") {
    const enrollments = await prisma.enrollment.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(enrollments);
  }

  const enrollments = await prisma.enrollment.findMany({
    where: {
      OR: [{ userId: auth.user.id }, { email: auth.user.email }],
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(enrollments);
}
