import { cookies } from "next/headers";
import type { Metadata } from "next";
import { BookingFlow } from "@/components/forms/client-forms";
import { SectionHeading } from "@/components/shared";
import { generateAvailableSlots } from "@/lib/booking";
import { prisma } from "@/lib/prisma";
import { seedTeachersIfNeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book a Free Trial Class",
  description: "Schedule your free one-on-one Quran trial class. Timezone-aware booking with certified teachers.",
};

export default async function FreeTrialPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; program?: string; teacher?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const timezone = cookieStore.get("timezone")?.value ?? "America/New_York";

  await seedTeachersIfNeeded();

  const dbTeachers = await prisma.teacher.findMany({
    include: { availability: true },
  });

  const availability = dbTeachers.flatMap((t) =>
    t.availability.map((a) => ({
      id: a.id,
      teacherId: t.id,
      teacherName: t.name,
      dayOfWeek: a.dayOfWeek,
      startHour: a.startHour,
      startMin: a.startMin,
      duration: a.duration,
    }))
  );

  const slots = generateAvailableSlots(availability, timezone);

  return (
    <div className="section-padding">
      <SectionHeading
        title="Book your free trial"
        description="No credit card required. Meet your teacher on Zoom and get a personalized learning plan."
      />
      <div className="mt-12">
        <BookingFlow
          initialCourse={params.course}
          initialProgram={params.program}
          initialTeacher={params.teacher}
          timezone={timezone}
          slots={slots}
        />
      </div>
    </div>
  );
}
