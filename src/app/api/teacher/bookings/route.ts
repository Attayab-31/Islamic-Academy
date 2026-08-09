import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateBookingStatus } from "@/lib/booking-status";

export async function GET(request: Request) {
    const session = await getSessionFromRequest(request as any);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "teacher" && session.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const teacher = session.role === "teacher"
        ? await prisma.teacher.findFirst({ where: { userId: session.id } })
        : null;

    const bookings = await prisma.booking.findMany({
        where: teacher ? { teacherId: teacher.id } : {},
        orderBy: { slotStart: "asc" },
        take: 50,
        include: {
            teacher: true,
            user: true,
        },
    });

    return NextResponse.json({ ok: true, bookings });
}

export async function PATCH(request: Request) {
    const session = await getSessionFromRequest(request as any);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.role !== "teacher" && session.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const bookingId = typeof body.bookingId === "string" ? body.bookingId : null;
    const status = typeof body.status === "string" ? body.status : null;

    if (!bookingId || !status) {
        return NextResponse.json({ error: "bookingId and status are required" }, { status: 400 });
    }

    let normalizedStatus: string;
    try {
        normalizedStatus = validateBookingStatus(status);
    } catch {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const teacher = session.role === "teacher"
        ? await prisma.teacher.findFirst({ where: { userId: session.id } })
        : null;

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (teacher && booking.teacherId !== teacher.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (booking.status === "completed" && normalizedStatus !== "completed") {
        return NextResponse.json({ error: "Completed classes cannot be reopened through this flow." }, { status: 400 });
    }

    if (booking.status === "cancelled" && normalizedStatus !== "cancelled") {
        return NextResponse.json({ error: "Cancelled classes cannot be reactivated through this flow." }, { status: 400 });
    }

    const previousStatus = booking.status;

    const [updatedBooking] = await prisma.$transaction(async (tx) => {
        const updated = await tx.booking.update({
            where: { id: bookingId },
            data: { status: normalizedStatus },
        });

        await tx.bookingAuditEvent.create({
            data: {
                bookingId,
                actorUserId: session.id,
                eventType: "booking_status_updated",
                previousStatus,
                newStatus: normalizedStatus,
                details: `Booking status changed from ${previousStatus} to ${normalizedStatus}`,
            },
        });

        return [updated];
    });

    return NextResponse.json({ ok: true, booking: updatedBooking });
}
