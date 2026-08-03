import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const enrollment = await prisma.enrollment.create({
            data: {
                fullName: body.fullName,
                email: body.email,
                phone: body.phone ?? null,
                country: body.country,
                courseSlug: body.courseSlug,
                planName: body.planName,
                amount: Number(body.amount ?? 0),
                currency: body.currency ?? "USD",
                paymentMethod: body.paymentMethod ?? "bank_transfer",
                paymentReference: body.paymentReference ?? null,
                paymentStatus: body.paymentStatus ?? "pending",
                transferBank: body.transferBank ?? null,
                transferAccountName: body.transferAccountName ?? null,
                transferAccountNumber: body.transferAccountNumber ?? null,
                adminNotes: body.adminNotes ?? null,
            },
        });

        return NextResponse.json({ ok: true, enrollment });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Enrollment failed" }, { status: 500 });
    }
}

export async function GET() {
    const enrollments = await prisma.enrollment.findMany({
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(enrollments);
}
