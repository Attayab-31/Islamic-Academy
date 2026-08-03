import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedTeachersIfNeeded } from "@/lib/seed";

function generateReference() {
  return `IA-${Date.now().toString(36).toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    await seedTeachersIfNeeded();
    const body = await request.json();

    const reference = generateReference();
    const zoomLink = `https://zoom.us/j/${Math.floor(100000000 + Math.random() * 900000000)}`;

    const teacher = body.teacherId
      ? await prisma.teacher.findUnique({ where: { id: body.teacherId } })
      : null;

    const booking = await prisma.booking.create({
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
        slotStart: new Date(body.slotStart),
        slotEnd: new Date(body.slotEnd),
        zoomLink,
        whatsappOptIn: body.whatsappOptIn ?? false,
      },
    });

    await prisma.enrollment.create({
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

    // Server-side conversion event placeholder (GA4 Measurement Protocol / internal analytics)
    console.info("[conversion] trial_booking", { reference, course: body.courseSlug });

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
