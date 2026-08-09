import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-guards";
import { buildConfirmedAccessWindow } from "@/lib/enrollment-access";
import { prisma } from "@/lib/prisma";
import { activateEnrollmentAccess } from "@/lib/subscriptions";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.user) return auth.response!;

  try {
    const { id } = await params;
    const body = await request.json();

    const nextPaymentStatus = body.paymentStatus ?? "pending_review";
    const accessState = nextPaymentStatus === "confirmed"
      ? activateEnrollmentAccess({ paymentStatus: nextPaymentStatus }, new Date())
      : { paymentStatus: nextPaymentStatus, accessStatus: nextPaymentStatus === "rejected" ? "rejected" : "pending", activatedAt: null, expiresAt: null };

    const updated = await prisma.$transaction(async (tx) => {
      return tx.enrollment.update({
        where: { id },
        data: {
          paymentStatus: accessState.paymentStatus,
          accessStatus: accessState.accessStatus,
          activatedAt: accessState.activatedAt,
          expiresAt: accessState.expiresAt,
          adminNotes: body.adminNotes ?? null,
        },
      });
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
