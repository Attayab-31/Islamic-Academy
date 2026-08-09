import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateBookingStatus } from "@/lib/booking-status";

export const dynamic = "force-dynamic";

async function updateBookingStatus(formData: FormData) {
    "use server";

    const user = await getCurrentUser();
    if (!user || user.role !== "teacher") {
        throw new Error("Unauthorized");
    }

    const bookingId = formData.get("bookingId")?.toString();
    const status = formData.get("status")?.toString();

    if (!bookingId || !status) return;

    let normalizedStatus: string;
    try {
        normalizedStatus = validateBookingStatus(status);
    } catch {
        throw new Error("Invalid booking status");
    }

    const teacher = await prisma.teacher.findFirst({ where: { userId: user.id } });
    if (!teacher) throw new Error("Teacher profile is not linked to this account.");

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.teacherId !== teacher.id) {
        throw new Error("This booking is not assigned to the current teacher.");
    }

    const previousBooking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!previousBooking || previousBooking.teacherId !== teacher.id) {
        throw new Error("This booking is not assigned to the current teacher.");
    }

    if (previousBooking.status === "completed" && normalizedStatus !== "completed") {
        throw new Error("Completed classes cannot be reopened through this flow.");
    }

    if (previousBooking.status === "cancelled" && normalizedStatus !== "cancelled") {
        throw new Error("Cancelled classes cannot be reactivated through this flow.");
    }

    await prisma.$transaction(async (tx) => {
        await tx.booking.update({
            where: { id: bookingId },
            data: { status: normalizedStatus },
        });

        await tx.bookingAuditEvent.create({
            data: {
                bookingId,
                actorUserId: user.id,
                eventType: "booking_status_updated",
                previousStatus: previousBooking.status,
                newStatus: normalizedStatus,
                details: `Teacher updated status from ${previousBooking.status} to ${normalizedStatus}`,
            },
        });
    });

    revalidatePath("/teacher");
}

export default async function TeacherPage() {
    const user = await getCurrentUser();
    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
        redirect("/login?redirect=/teacher");
    }

    const teacher = user.role === "teacher"
        ? await prisma.teacher.findFirst({
            where: { userId: user.id },
            include: {
                availability: true,
            },
        })
        : null;

    const bookings = teacher
        ? await prisma.booking.findMany({
            where: { teacherId: teacher.id },
            orderBy: { slotStart: "asc" },
            take: 25,
            include: {
                teacher: true,
                user: true,
            },
        })
        : await prisma.booking.findMany({
            orderBy: { slotStart: "asc" },
            take: 25,
            include: {
                teacher: true,
                user: true,
            },
        });

    return (
        <div className="section-padding">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl">Teacher dashboard</h1>
                        <p className="mt-3 text-muted-foreground">
                            Signed in as {user.name} ({user.email}). Manage your booking pipeline and class schedule.
                        </p>
                    </div>
                    <Link href="/api/auth/logout" className="text-sm text-gold hover:underline">Sign out</Link>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <div className="glass-card p-5">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Upcoming classes</div>
                        <div className="mt-2 text-3xl font-display">{bookings.length}</div>
                    </div>
                    <div className="glass-card p-5">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Teacher profile</div>
                        <div className="mt-2 text-xl font-display">{teacher?.name ?? "Admin workspace"}</div>
                    </div>
                    <div className="glass-card p-5">
                        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Session status</div>
                        <div className="mt-2 text-xl font-display">Ready</div>
                    </div>
                </div>

                <div className="mt-8 overflow-hidden rounded-xl border border-border">
                    <table className="min-w-full divide-y divide-border text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 text-left">Student</th>
                                <th className="px-4 py-3 text-left">Family contact</th>
                                <th className="px-4 py-3 text-left">Teacher</th>
                                <th className="px-4 py-3 text-left">Course</th>
                                <th className="px-4 py-3 text-left">Start time</th>
                                <th className="px-4 py-3 text-left">Zoom</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="border-t border-border align-top">
                                    <td className="px-4 py-3">{booking.learnerName}</td>
                                    <td className="px-4 py-3">{booking.contactName} · {booking.contactEmail}</td>
                                    <td className="px-4 py-3">{booking.teacher?.name ?? teacher?.name ?? "Academy"}</td>
                                    <td className="px-4 py-3">{booking.courseSlug}</td>
                                    <td className="px-4 py-3">{new Date(booking.slotStart).toLocaleString()}</td>
                                    <td className="px-4 py-3">{booking.zoomLink ?? "—"}</td>
                                    <td className="px-4 py-3">{booking.status}</td>
                                    <td className="px-4 py-3">
                                        {user.role === "teacher" && teacher && booking.teacherId === teacher.id ? (
                                            <form action={updateBookingStatus} className="flex flex-wrap gap-2">
                                                <input type="hidden" name="bookingId" value={booking.id} />
                                                <select name="status" defaultValue={booking.status} className="rounded border border-border bg-background px-2 py-1 text-xs">
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                                <button type="submit" className="rounded bg-gold px-2 py-1 text-xs text-night">Save</button>
                                            </form>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Admin view</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!teacher && user.role === "teacher" && (
                    <div className="mt-6 rounded-lg border border-amber-400/40 bg-amber-500/10 p-4 text-sm">
                        This account is authenticated but is not linked to a teacher profile yet. Ask an admin to connect the account to a teacher record.
                    </div>
                )}
            </div>
        </div>
    );
}
