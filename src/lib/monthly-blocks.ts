import { addDays, startOfDay } from "./dates";
import { prisma } from "@/lib/prisma";
import { createMeeting } from "@/lib/meetings";
import { sendEmail } from "@/lib/email";

const weekdayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const lookAheadDays = 7;

function isReminderWindow(startAt: Date, now: Date) {
    const diffMs = startAt.getTime() - now.getTime();
    return diffMs >= 0 && diffMs <= 30 * 60 * 1000;
}

function getDayCountBetween(start: Date, end: Date) {
    const startDay = startOfDay(start);
    const endDay = startOfDay(end);
    const diffMs = endDay.getTime() - startDay.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

async function processEnrollmentMonthlyBlock(enrollment: { id: string; teacherId: string | null; email: string; fullName: string; courseSlug: string; country: string; monthlyBlockStartAt: Date | null; monthlyBlockEndAt: Date | null }) {
    const now = new Date();
    const nowDay = startOfDay(now);

    if (!enrollment.teacherId) return;

    const teacher = await prisma.teacher.findUnique({ where: { id: enrollment.teacherId } });
    if (!teacher) return;

    const availability = await prisma.availabilitySlot.findMany({
        where: { teacherId: teacher.id },
        orderBy: [{ dayOfWeek: "asc" }, { startHour: "asc" }, { startMin: "asc" }],
    });

    if (availability.length === 0) return;

    const blockStart = enrollment.monthlyBlockStartAt ? startOfDay(enrollment.monthlyBlockStartAt) : nowDay;
    const blockEnd = enrollment.monthlyBlockEndAt ? startOfDay(enrollment.monthlyBlockEndAt) : nowDay;
    const totalDays = getDayCountBetween(blockStart, blockEnd);

    for (let offset = 0; offset <= totalDays && offset <= lookAheadDays; offset += 1) {
        const slotDate = addDays(blockStart, offset);
        if (slotDate < nowDay) continue;
        if (slotDate > addDays(nowDay, lookAheadDays)) continue;
        if (slotDate > blockEnd) continue;

        for (const slot of availability) {
            if (slot.dayOfWeek !== slotDate.getDay()) continue;

            const slotStart = new Date(slotDate);
            slotStart.setHours(slot.startHour, slot.startMin, 0, 0);
            const slotEnd = new Date(slotStart.getTime() + slot.duration * 60000);

            if (slotStart < now) continue;

            const existingBooking = await prisma.booking.findFirst({
                where: {
                    teacherId: teacher.id,
                    contactEmail: enrollment.email,
                    slotStart,
                },
            });

            if (existingBooking) {
                if (!existingBooking.reminderSentAt && isReminderWindow(slotStart, now)) {
                    await prisma.booking.update({ where: { id: existingBooking.id }, data: { reminderSentAt: now } });
                    await sendEmail({
                        to: enrollment.email,
                        subject: `Your class link for ${weekdayLabels[slot.dayOfWeek] ?? "today"}`,
                        text: `Hello ${enrollment.fullName},\n\nYour class starts at ${slotStart.toLocaleString()} and the Zoom link is: ${existingBooking.zoomLink ?? "Please check your dashboard"}`,
                        html: `<p>Hello ${enrollment.fullName},</p><p>Your class starts at ${slotStart.toLocaleString()} and the Zoom link is: <a href="${existingBooking.zoomLink ?? "#"}">${existingBooking.zoomLink ?? "Please check your dashboard"}</a></p>`,
                    });
                }
                continue;
            }

            const meeting = await createMeeting({
                topic: `${enrollment.courseSlug} Monthly Block`,
                startTime: slotStart,
                durationMinutes: slot.duration,
                timezone: teacher.timezone ?? "UTC",
                contactEmail: enrollment.email,
                teacherZoomUserId: teacher.zoomUserId ?? null,
                teacherId: teacher.id,
                teacherName: teacher.name,
            });

            const booking = await prisma.$transaction(async (tx) => {
                const createdBooking = await tx.booking.create({
                    data: {
                        reference: `MB-${Date.now().toString(36).toUpperCase()}`,
                        courseSlug: enrollment.courseSlug,
                        teacherId: teacher.id,
                        learnerName: enrollment.fullName,
                        learnerAge: "adult",
                        level: "beginner",
                        language: "English",
                        teacherGender: teacher.gender,
                        contactName: enrollment.fullName,
                        contactEmail: enrollment.email,
                        country: enrollment.country,
                        timezone: teacher.timezone ?? "UTC",
                        slotStart,
                        slotEnd,
                        zoomLink: meeting.joinUrl,
                        status: "confirmed",
                        whatsappOptIn: false,
                    },
                });

                if (isReminderWindow(slotStart, now)) {
                    await tx.booking.update({ where: { id: createdBooking.id }, data: { reminderSentAt: now } });
                }

                return createdBooking;
            });

            if (isReminderWindow(slotStart, now)) {
                await sendEmail({
                    to: enrollment.email,
                    subject: `Your class link for ${weekdayLabels[slot.dayOfWeek] ?? "today"}`,
                    text: `Hello ${enrollment.fullName},\n\nYour class starts at ${slotStart.toLocaleString()} and the Zoom link is: ${booking.zoomLink ?? meeting.joinUrl}`,
                    html: `<p>Hello ${enrollment.fullName},</p><p>Your class starts at ${slotStart.toLocaleString()} and the Zoom link is: <a href="${booking.zoomLink ?? meeting.joinUrl}">${booking.zoomLink ?? meeting.joinUrl}</a></p>`,
                });
            }
        }
    }
}

export async function generateMonthlyBlockSessions() {
    const enrollments = await prisma.enrollment.findMany({
        where: {
            paymentStatus: "confirmed",
            monthlyBlockStartAt: { not: null },
            monthlyBlockEndAt: { not: null },
            teacherId: { not: null },
        },
        orderBy: { createdAt: "asc" },
        select: {
            id: true,
            teacherId: true,
            email: true,
            fullName: true,
            courseSlug: true,
            country: true,
            monthlyBlockStartAt: true,
            monthlyBlockEndAt: true,
        },
    });

    for (const enrollment of enrollments) {
        await processEnrollmentMonthlyBlock(enrollment);
    }
}

export async function generateMonthlyBlockSessionsForEnrollment(enrollmentId: string) {
    const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
        select: {
            id: true,
            teacherId: true,
            email: true,
            fullName: true,
            courseSlug: true,
            country: true,
            monthlyBlockStartAt: true,
            monthlyBlockEndAt: true,
        },
    });

    if (!enrollment) return false;

    await processEnrollmentMonthlyBlock(enrollment);
    return true;
}
