import Link from "next/link";
import { redirect } from "next/navigation";
import { CTABand, SectionHeading } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { getEnrollmentAccessState } from "@/lib/enrollment-access";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function PortalPage() {
    const user = await getCurrentUser();
    if (!user || user.role !== "parent") {
        redirect("/login?redirect=/portal");
    }

    const [enrollments, bookings] = await Promise.all([
        prisma.enrollment.findMany({
            where: {
                OR: [{ userId: user.id }, { email: user.email }],
            },
            orderBy: { createdAt: "desc" },
            take: 10,
        }),
        prisma.booking.findMany({
            where: {
                OR: [{ userId: user.id }, { contactEmail: user.email }],
            },
            orderBy: { slotStart: "asc" },
            take: 10,
            include: {
                teacher: true,
            },
        }),
    ]);

    const enrichedEnrollments = enrollments.map((item) => ({
        ...item,
        access: getEnrollmentAccessState({
            paymentStatus: item.paymentStatus,
            accessStatus: item.accessStatus,
            accessStartAt: item.activatedAt,
            accessEndAt: item.expiresAt,
        }),
    }));

    return (
        <>
            <div className="section-padding">
                <div className="mx-auto max-w-4xl">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <SectionHeading
                            title="Family portal"
                            description={`Welcome back, ${user.name}. Review schedules, enrollments, and payment status in one place.`}
                        />
                        <Link href="/api/auth/logout" className="text-sm text-gold hover:underline">Sign out</Link>
                    </div>

                    <div className="mt-10 grid gap-6 md:grid-cols-2">
                        <div className="glass-card p-6">
                            <h2 className="font-display text-xl">Upcoming lessons</h2>
                            {bookings.length === 0 ? (
                                <p className="mt-3 text-muted-foreground">No upcoming bookings yet.</p>
                            ) : (
                                <ul className="mt-4 space-y-3 text-sm">
                                    {bookings.map((booking) => (
                                        <li key={booking.id} className="rounded-lg border border-border p-3">
                                            <p className="font-medium">{booking.learnerName} · {booking.courseSlug}</p>
                                            <p className="text-muted-foreground">Teacher: {booking.teacher?.name ?? "Your assigned teacher"}</p>
                                            <p className="text-muted-foreground">{new Date(booking.slotStart).toLocaleString()}</p>
                                            <p className="text-muted-foreground">Zoom: {booking.zoomLink ?? "Pending"}</p>
                                            <p className="text-muted-foreground">Ref: {booking.reference}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="glass-card p-6">
                            <h2 className="font-display text-xl">Payments & enrollments</h2>
                            {enrichedEnrollments.length === 0 ? (
                                <p className="mt-3 text-muted-foreground">No enrollments linked to your account yet.</p>
                            ) : (
                                <ul className="mt-4 space-y-3 text-sm">
                                    {enrollments.map((item) => (
                                        <li key={item.id} className="rounded-lg border border-border p-3">
                                            <p className="font-medium">{item.courseSlug} · {item.planName}</p>
                                            <p className="text-muted-foreground">{formatCurrency(item.amount, item.currency)} · {item.paymentStatus}</p>
                                            <p className="mt-1 text-xs text-gold">Access: {item.accessStatus ?? "pending"}</p>
                                            {item.expiresAt ? <p className="mt-1 text-xs text-muted-foreground">Valid until {new Date(item.expiresAt).toLocaleDateString()}</p> : null}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Button asChild>
                            <Link href="/payment">View payment instructions</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/free-trial">Book a free trial</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <CTABand />
        </>
    );
}
