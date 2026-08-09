import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedTeachersIfNeeded } from "@/lib/seed";
import { sendBookingConfirmationEmail } from "@/lib/email";
import { createMeeting } from "@/lib/meetings";

function generateReference() {
  return `IA-${Date.now().toString(36).toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    await seedTeachersIfNeeded();
    const body = await request.json();

    const reference = generateReference();

    const teacher = body.teacherId
      ? await prisma.teacher.findUnique({ where: { id: body.teacherId } })
      : null;

    const proposedStart = new Date(body.slotStart);
    const proposedEnd = new Date(body.slotEnd);

    const meeting = await createMeeting({
      topic: `${body.courseSlug ?? "Islamic Academy"} Free Trial`,
      startTime: new Date(body.slotStart),
      durationMinutes: 45,
      timezone: body.timezone ?? "UTC",
      contactEmail: body.contactEmail,
      teacherZoomUserId: teacher?.zoomUserId ?? null,
      teacherId: teacher?.id ?? body.teacherId ?? null,
      teacherName: teacher?.name ?? "Your assigned teacher",
    });

    const [booking, enrollment] = await prisma.$transaction(async (tx) => {
      const createdBooking = await tx.booking.create({
        data: {
          reference,
          courseSlug: body.courseSlug,
          programSlug: body.programSlug ?? null,
          teacherId: body.teacherId ?? null,
          learnerName: body.learnerName,
          learnerAge: body.learnerAge,
          level: body.level,
          language: body.language,
          teacherGender: body.teacherGender,
          contactName: body.contactName,
          contactEmail: body.contactEmail,
          contactPhone: body.contactPhone ?? null,
          country: body.country,
          timezone: body.timezone,
          slotStart: proposedStart,
          slotEnd: proposedEnd,
          zoomLink: meeting.joinUrl,
          whatsappOptIn: body.whatsappOptIn ?? false,
        },
      });

      const createdEnrollment = await tx.enrollment.create({
        data: {
          fullName: body.contactName,
          email: body.contactEmail,
          phone: body.contactPhone ?? null,
          country: body.country,
          courseSlug: body.courseSlug,
          planName: "Free Trial Enrollment",
          amount: 0,
          currency: body.timezone?.includes("USD") ? "USD" : "USD",
          paymentMethod: "direct_transfer",
          paymentStatus: "pending_review",
          paymentReference: reference,
        },
      });

      return [createdBooking, createdEnrollment] as const;
    });

    try {
      await sendBookingConfirmationEmail({
        to: booking.contactEmail,
        contactName: booking.contactName,
        learnerName: booking.learnerName,
        reference: booking.reference,
        courseSlug: booking.courseSlug,
        teacherName: teacher?.name ?? "Your assigned teacher",
        start: booking.slotStart,
        end: booking.slotEnd,
        zoomLink: booking.zoomLink ?? meeting.joinUrl,
      });
    } catch (emailError) {
      console.error("Booking confirmation email failed:", emailError);
    }

    // Server-side conversion event placeholder (GA4 Measurement Protocol / internal analytics)
    console.info("[conversion] trial_booking", { reference, course: body.courseSlug, meetingProvider: meeting.provider, meetingId: meeting.meetingId });

    return NextResponse.json({
      reference: booking.reference,
      zoomLink: booking.zoomLink,
      teacherName: teacher?.name ?? "Your assigned teacher",
      slotStart: booking.slotStart.toISOString(),
      slotEnd: booking.slotEnd.toISOString(),
      courseSlug: booking.courseSlug,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}
