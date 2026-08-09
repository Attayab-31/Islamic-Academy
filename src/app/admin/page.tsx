import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { getEnrollmentAccessState } from "@/lib/enrollment-access";
import { collectAvailabilitySlotInputs, findConflictingSlots } from "@/lib/availability";
import { AvailabilityForm } from "@/components/admin/availability-form";
import { TeacherLoginForm } from "@/components/admin/teacher-login-form";
import { generateMonthlyBlockSessionsForEnrollment } from "@/lib/monthly-blocks";
import { deleteTeacherAndLogin } from "@/lib/teacher-admin";
import { UserRole } from "@prisma/client";

const weekdayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const dynamic = "force-dynamic";

async function updateStatus(formData: FormData) {
    "use server";

    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const id = formData.get("id")?.toString();
    const paymentStatus = formData.get("paymentStatus")?.toString();
    const adminNotes = formData.get("adminNotes")?.toString();

    if (!id || !paymentStatus) return;

    await prisma.enrollment.update({
        where: { id },
        data: { paymentStatus, adminNotes: adminNotes ?? null },
    });

    revalidatePath("/admin");
}

async function createTeacher(formData: FormData) {
    "use server";

    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const payload = {
        name: formData.get("name")?.toString()?.trim() ?? "",
        gender: formData.get("gender")?.toString()?.trim() ?? "female",
        languages: formData.get("languages")?.toString()?.trim() ?? "English",
        specializations: formData.get("specializations")?.toString()?.trim() ?? "Quran",
        email: formData.get("email")?.toString()?.trim() ?? null,
        timezone: formData.get("timezone")?.toString()?.trim() ?? "UTC",
        slug: formData.get("slug")?.toString()?.trim() ?? "",
    };

    if (!payload.name || !payload.slug) {
        throw new Error("Name and slug are required.");
    }

    const normalizedSlug = payload.slug.toLowerCase().replace(/[^a-z0-9-]+/g, "-");

    await prisma.$transaction(async (tx) => {
        const existingTeacher = await tx.teacher.findFirst({
            where: { slug: normalizedSlug },
        });

        if (existingTeacher) {
            throw new Error("A teacher with this slug already exists.");
        }

        await tx.teacher.create({
            data: {
                name: payload.name,
                slug: normalizedSlug,
                gender: payload.gender,
                languages: payload.languages,
                specializations: payload.specializations,
                email: payload.email ?? null,
                timezone: payload.timezone,
            },
        });
    });

    revalidatePath("/admin");
}

async function createAvailabilitySlot(formData: FormData) {
    "use server";

    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const teacherId = formData.get("teacherId")?.toString();
    const selectedDays = formData.getAll("selectedDays") as string[];
    const capacity = Number(formData.get("capacity")?.toString() ?? "10");

    if (!teacherId) {
        throw new Error("Please select a teacher.");
    }

    if (selectedDays.length === 0) {
        throw new Error("Please select at least one day.");
    }

    const slotsToCreate = collectAvailabilitySlotInputs(selectedDays, Object.fromEntries(formData.entries())).map((slot) => ({
        ...slot,
        capacity: Math.max(1, capacity),
    }));

    if (slotsToCreate.length === 0) {
        throw new Error("Please provide a valid start time and duration for each selected day.");
    }

    await prisma.$transaction(async (tx) => {
        const existingSlots = await tx.availabilitySlot.findMany({
            where: { teacherId },
            select: { dayOfWeek: true, startHour: true, startMin: true, duration: true },
        });

        const conflicts = findConflictingSlots(existingSlots, slotsToCreate);
        if (conflicts.length > 0) {
            throw new Error("This teacher already has an overlapping slot on one of the selected days.");
        }

        await tx.availabilitySlot.createMany({
            data: slotsToCreate.map((slot) => ({
                teacherId,
                dayOfWeek: slot.dayOfWeek,
                startHour: slot.startHour,
                startMin: slot.startMin,
                duration: slot.duration,
                capacity: slot.capacity,
                timezone: "UTC",
            })),
        });
    });

    revalidatePath("/admin");
}

async function deleteAvailabilitySlotGroup(formData: FormData) {
    "use server";

    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const groupKey = formData.get("groupKey")?.toString();
    if (!groupKey) return;

    const [teacherId, time, duration, capacity] = groupKey.split("|");
    const [startHour, startMin] = time.split(":").map((value) => Number(value));

    await prisma.availabilitySlot.deleteMany({
        where: {
            teacherId,
            startHour,
            startMin,
            duration: Number(duration),
            capacity: Number(capacity),
        },
    });

    revalidatePath("/admin");
}

async function updateTeacher(formData: FormData) {
    "use server";

    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const teacherId = formData.get("teacherId")?.toString();
    const name = formData.get("name")?.toString()?.trim();
    const gender = formData.get("gender")?.toString()?.trim();
    const languages = formData.get("languages")?.toString()?.trim();
    const specializations = formData.get("specializations")?.toString()?.trim();
    const email = formData.get("email")?.toString()?.trim() ?? null;
    const timezone = formData.get("timezone")?.toString()?.trim();

    if (!teacherId || !name || !gender || !languages || !specializations || !timezone) {
        throw new Error("Teacher profile update requires all fields.");
    }

    await prisma.teacher.update({
        where: { id: teacherId },
        data: {
            name,
            gender,
            languages,
            specializations,
            email,
            timezone,
        },
    });

    revalidatePath("/admin");
}

async function deleteTeacher(formData: FormData) {
    "use server";

    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const teacherId = formData.get("teacherId")?.toString();
    if (!teacherId) return;

    await deleteTeacherAndLogin(teacherId);

    revalidatePath("/admin");
}

async function assignTeacherUser(formData: FormData) {
    "use server";

    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const teacherId = formData.get("teacherId")?.toString();
    const userId = formData.get("userId")?.toString();
    const zoomUserId = formData.get("zoomUserId")?.toString()?.trim() ?? "";

    if (!teacherId) return;

    const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
    if (!teacher) return;

    const newUserId = userId && userId.trim().length > 0 ? userId : null;

    if (newUserId) {
        const selectedUser = await prisma.user.findUnique({ where: { id: newUserId } });
        if (!selectedUser || selectedUser.role !== UserRole.TEACHER) {
            throw new Error("Selected account is not a teacher account.");
        }
    }

    await prisma.$transaction(async (tx) => {
        if (newUserId) {
            const conflictingTeacher = await tx.teacher.findFirst({
                where: {
                    userId: newUserId,
                    NOT: { id: teacherId },
                },
            });

            if (conflictingTeacher) {
                throw new Error("This login account is already linked to another teacher profile.");
            }
        }

        await tx.teacher.update({
            where: { id: teacherId },
            data: {
                userId: newUserId,
                zoomUserId: zoomUserId.length > 0 ? zoomUserId : null,
            },
        });
    });

    revalidatePath("/admin");
}

async function activateMonthlyBlock(formData: FormData) {
    "use server";

    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    const enrollmentId = formData.get("enrollmentId")?.toString();
    if (!enrollmentId) return;

    await generateMonthlyBlockSessionsForEnrollment(enrollmentId);
    revalidatePath("/admin");
}

export default async function AdminPage() {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        redirect("/login?redirect=/admin");
    }

    const [enrollments, teachers, teacherUsers, availabilitySlots, auditEvents] = await Promise.all([
        prisma.enrollment.findMany({
            orderBy: { createdAt: "desc" },
        }),
        prisma.teacher.findMany({
            orderBy: { name: "asc" },
            include: { user: { select: { email: true, name: true } } },
        }),
        prisma.user.findMany({
            where: { role: UserRole.TEACHER },
            orderBy: { email: "asc" },
            select: { id: true, email: true, name: true },
        }),
        prisma.availabilitySlot.findMany({
            orderBy: [{ dayOfWeek: "asc" }, { startHour: "asc" }, { startMin: "asc" }],
            include: { teacher: true },
        }),
        prisma.bookingAuditEvent.findMany({
            orderBy: { createdAt: "desc" },
            take: 20,
            include: {
                booking: { select: { reference: true, learnerName: true, courseSlug: true } },
                actorUser: { select: { email: true, name: true } },
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

    const availabilityGroups = Object.values(
        availabilitySlots.reduce((groups, slot) => {
            const groupKey = `${slot.teacherId ?? "unknown"}|${slot.startHour}:${slot.startMin}|${slot.duration}|${slot.capacity}`;
            if (!groups[groupKey]) {
                groups[groupKey] = {
                    key: groupKey,
                    teacherName: slot.teacher?.name ?? "Unknown",
                    days: [] as number[],
                    slots: [] as typeof availabilitySlots,
                };
            }

            groups[groupKey].days.push(slot.dayOfWeek);
            groups[groupKey].slots.push(slot);
            return groups;
        }, {} as Record<string, { key: string; teacherName: string; days: number[]; slots: typeof availabilitySlots }>),
    ).sort((left, right) => left.teacherName.localeCompare(right.teacherName));

    return (
        <div className="section-padding">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl">Admin operations</h1>
                        <p className="mt-3 text-muted-foreground">
                            Signed in as {user.name} ({user.email}). Review enrollments, payment transfer details, and pending family onboarding.
                        </p>
                    </div>
                    <Link href="/api/auth/logout" className="text-sm text-gold hover:underline">Sign out</Link>
                </div>

                <section className="mt-8 rounded-xl border border-border bg-background p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="font-display text-2xl">Create teacher login</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Create the teacher’s sign-in account first. You can link it to a profile later.</p>
                        </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4">
                        <TeacherLoginForm />
                    </div>
                </section>

                <section className="mt-8 rounded-xl border border-border bg-background p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="font-display text-2xl">Weekly teacher timetable</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Add recurring weekly time slots so students can choose from a teacher&apos;s available schedule.</p>
                        </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4">
                        <div className="mb-3 rounded-lg border border-gold/30 bg-background/70 p-3 text-sm text-muted-foreground">
                            Create one recurring availability block that repeats across the selected days. Each selected day can have its own start time and duration while sharing the same capacity.
                        </div>
                        <form action={createAvailabilitySlot} className="space-y-4">
                            <label className="block space-y-1 text-xs font-medium text-muted-foreground">
                                <span>Teacher</span>
                                <select name="teacherId" className="w-full rounded border border-border bg-background px-2 py-2 text-sm" required>
                                    <option value="">Select teacher</option>
                                    {teachers.map((teacher) => (
                                        <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                                    ))}
                                </select>
                            </label>

                            <AvailabilityForm weekdayLabels={weekdayLabels} />

                            <div className="flex items-end">
                                <button type="submit" className="rounded bg-gold px-3 py-2 text-sm font-medium text-night">Create recurring block</button>
                            </div>
                        </form>
                    </div>

                    <div className="mt-4 overflow-hidden rounded-xl border border-border">
                        <table className="min-w-full divide-y divide-border text-sm">
                            <thead className="bg-muted/40">
                                <tr>
                                    <th className="px-4 py-3 text-left">Teacher</th>
                                    <th className="px-4 py-3 text-left">Days</th>
                                    <th className="px-4 py-3 text-left">Time</th>
                                    <th className="px-4 py-3 text-left">Duration</th>
                                    <th className="px-4 py-3 text-left">Capacity</th>
                                    <th className="px-4 py-3 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {availabilityGroups.map((group) => (
                                    <tr key={group.key} className="border-t border-border align-top">
                                        <td className="px-4 py-3">{group.teacherName}</td>
                                        <td className="px-4 py-3">{group.days.sort((left, right) => left - right).map((day) => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day]).join(', ')}</td>
                                        <td className="px-4 py-3">{group.slots[0]?.startHour.toString().padStart(2, '0')}:{group.slots[0]?.startMin.toString().padStart(2, '0')}</td>
                                        <td className="px-4 py-3">{group.slots[0]?.duration} min</td>
                                        <td className="px-4 py-3">{group.slots[0]?.capacity}</td>
                                        <td className="px-4 py-3">
                                            <form action={deleteAvailabilitySlotGroup}>
                                                <input type="hidden" name="groupKey" value={group.key} />
                                                <button type="submit" className="rounded border border-destructive px-2 py-1 text-xs text-destructive">Remove block</button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="mt-8 rounded-xl border border-border bg-background p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="font-display text-2xl">Teacher accounts</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Create, edit, delete, and map teacher profiles to Zoom and login identity.</p>
                        </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4">
                        <form action={createTeacher} className="grid gap-3 md:grid-cols-6">
                            <input name="name" placeholder="Teacher name" className="rounded border border-border bg-background px-2 py-2 text-xs" required />
                            <input name="slug" placeholder="teacher-slug" className="rounded border border-border bg-background px-2 py-2 text-xs" required />
                            <select name="gender" defaultValue="female" className="rounded border border-border bg-background px-2 py-2 text-xs">
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                            </select>
                            <input name="languages" placeholder="Languages" defaultValue="English" className="rounded border border-border bg-background px-2 py-2 text-xs" />
                            <input name="specializations" placeholder="Specialization" defaultValue="Quran" className="rounded border border-border bg-background px-2 py-2 text-xs" />
                            <input name="email" placeholder="email@example.com" className="rounded border border-border bg-background px-2 py-2 text-xs" />
                            <input name="timezone" placeholder="UTC" defaultValue="UTC" className="rounded border border-border bg-background px-2 py-2 text-xs" />
                            <button type="submit" className="rounded bg-gold px-3 py-2 text-xs font-medium text-night">Add teacher</button>
                        </form>
                    </div>

                    <div className="mt-4 overflow-hidden rounded-xl border border-border">
                        <table className="min-w-full divide-y divide-border text-sm">
                            <thead className="bg-muted/40">
                                <tr>
                                    <th className="px-4 py-3 text-left">Teacher profile</th>
                                    <th className="px-4 py-3 text-left">Linked login</th>
                                    <th className="px-4 py-3 text-left">Zoom account</th>
                                    <th className="px-4 py-3 text-left">Link & save</th>
                                    <th className="px-4 py-3 text-left">Edit & delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map((teacher) => (
                                    <tr key={teacher.id} className="border-t border-border align-top">
                                        <td className="px-4 py-3 font-medium">
                                            <div>{teacher.name}</div>
                                            <div className="mt-1 text-xs text-muted-foreground">{teacher.slug}</div>
                                        </td>
                                        <td className="px-4 py-3">{teacher.user?.email ?? "Not linked"}</td>
                                        <td className="px-4 py-3">{teacher.zoomUserId ?? "Not set"}</td>
                                        <td className="px-4 py-3">
                                            <form action={assignTeacherUser} className="flex flex-wrap gap-2">
                                                <input type="hidden" name="teacherId" value={teacher.id} />
                                                <select name="userId" defaultValue={teacher.userId ?? ""} className="rounded border border-border bg-background px-2 py-1 text-xs">
                                                    <option value="">Unlinked</option>
                                                    {teacherUsers.map((item) => (
                                                        <option key={item.id} value={item.id}>{item.email}</option>
                                                    ))}
                                                </select>
                                                <input type="text" name="zoomUserId" defaultValue={teacher.zoomUserId ?? ""} placeholder="Zoom user id" className="rounded border border-border bg-background px-2 py-1 text-xs" />
                                                <button type="submit" className="rounded bg-gold px-2 py-1 text-xs text-night">Save link</button>
                                            </form>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-2">
                                                <form action={updateTeacher} className="space-y-2">
                                                    <input type="hidden" name="teacherId" value={teacher.id} />
                                                    <input type="text" name="name" defaultValue={teacher.name} placeholder="Name" className="rounded border border-border bg-background px-2 py-1 text-xs" />
                                                    <input type="text" name="gender" defaultValue={teacher.gender} placeholder="Gender" className="rounded border border-border bg-background px-2 py-1 text-xs" />
                                                    <input type="text" name="languages" defaultValue={teacher.languages} placeholder="Languages" className="rounded border border-border bg-background px-2 py-1 text-xs" />
                                                    <input type="text" name="specializations" defaultValue={teacher.specializations} placeholder="Specializations" className="rounded border border-border bg-background px-2 py-1 text-xs" />
                                                    <input type="text" name="email" defaultValue={teacher.email ?? ""} placeholder="Email" className="rounded border border-border bg-background px-2 py-1 text-xs" />
                                                    <input type="text" name="timezone" defaultValue={teacher.timezone} placeholder="Timezone" className="rounded border border-border bg-background px-2 py-1 text-xs" />
                                                    <button type="submit" className="rounded border border-border px-2 py-1 text-xs">Update profile</button>
                                                </form>
                                                <form action={deleteTeacher}>
                                                    <input type="hidden" name="teacherId" value={teacher.id} />
                                                    <button type="submit" className="rounded border border-destructive px-2 py-1 text-xs text-destructive">Delete teacher</button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="mt-8 rounded-xl border border-border bg-background p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="font-display text-2xl">Booking audit trail</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Review recent booking changes and admin actions for visibility and follow-up.</p>
                        </div>
                    </div>
                    <div className="mt-4 overflow-hidden rounded-xl border border-border">
                        <table className="min-w-full divide-y divide-border text-sm">
                            <thead className="bg-muted/40">
                                <tr>
                                    <th className="px-4 py-3 text-left">Booking</th>
                                    <th className="px-4 py-3 text-left">Event</th>
                                    <th className="px-4 py-3 text-left">Previous</th>
                                    <th className="px-4 py-3 text-left">New</th>
                                    <th className="px-4 py-3 text-left">Actor</th>
                                    <th className="px-4 py-3 text-left">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditEvents.map((event) => (
                                    <tr key={event.id} className="border-t border-border align-top">
                                        <td className="px-4 py-3">{event.booking.reference} · {event.booking.learnerName}</td>
                                        <td className="px-4 py-3">{event.eventType}</td>
                                        <td className="px-4 py-3">{event.previousStatus ?? "—"}</td>
                                        <td className="px-4 py-3">{event.newStatus ?? "—"}</td>
                                        <td className="px-4 py-3">{event.actorUser?.email ?? "system"}</td>
                                        <td className="px-4 py-3">{new Date(event.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="mt-8 overflow-hidden rounded-xl border border-border">
                    <table className="min-w-full divide-y divide-border text-sm">
                        <thead className="bg-muted/40">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Course</th>
                                <th className="px-4 py-3 text-left">Plan</th>
                                <th className="px-4 py-3 text-left">Amount</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Access</th>
                                <th className="px-4 py-3 text-left">Valid until</th>
                                <th className="px-4 py-3 text-left">Reference</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrichedEnrollments.map((item) => (
                                <tr key={item.id} className="border-t border-border align-top">
                                    <td className="px-4 py-3">{item.fullName}</td>
                                    <td className="px-4 py-3">{item.email}</td>
                                    <td className="px-4 py-3">{item.courseSlug}</td>
                                    <td className="px-4 py-3">{item.planName}</td>
                                    <td className="px-4 py-3">{formatCurrency(item.amount, item.currency)}</td>
                                    <td className="px-4 py-3">{item.paymentStatus}</td>
                                    <td className="px-4 py-3">{item.accessStatus ?? "pending"}</td>
                                    <td className="px-4 py-3">{item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : "—"}</td>
                                    <td className="px-4 py-3">{item.paymentReference ?? "—"}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-2">
                                            <form action={updateStatus} className="flex flex-wrap gap-2">
                                                <input type="hidden" name="id" value={item.id} />
                                                <select name="paymentStatus" defaultValue={item.paymentStatus} className="rounded border border-border bg-background px-2 py-1 text-xs">
                                                    <option value="pending_review">Pending review</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                                <input type="text" name="adminNotes" defaultValue={item.adminNotes ?? ""} placeholder="Notes" className="rounded border border-border bg-background px-2 py-1 text-xs" />
                                                <button type="submit" className="rounded bg-gold px-2 py-1 text-xs text-night">Save</button>
                                            </form>
                                            {item.paymentStatus === "confirmed" && item.teacherId ? (
                                                <form action={activateMonthlyBlock}>
                                                    <input type="hidden" name="enrollmentId" value={item.id} />
                                                    <button type="submit" className="rounded border border-gold/40 bg-background px-2 py-1 text-xs text-gold">Activate monthly block</button>
                                                </form>
                                            ) : null}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
