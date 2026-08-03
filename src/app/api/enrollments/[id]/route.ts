import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updated = await prisma.enrollment.update({
            where: { id },
            data: {
                paymentStatus: body.paymentStatus ?? "pending_review",
                adminNotes: body.adminNotes ?? null,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
