import { teachers } from "@/data/teachers";
import { prisma } from "@/lib/prisma";

export async function seedTeachersIfNeeded() {
  const existingTeachers = await prisma.teacher.findMany({
    select: { slug: true },
  });
  const existingSlugs = new Set(existingTeachers.map((teacher) => teacher.slug));

  for (const t of teachers) {
    if (existingSlugs.has(t.slug)) continue;

    const teacher = await prisma.teacher.create({
      data: {
        slug: t.slug,
        name: t.name,
        gender: t.gender,
        languages: t.languages.join(","),
        specializations: t.specializations.join(","),
        timezone: "UTC",
      },
    });

    existingSlugs.add(teacher.slug);

    const days = [1, 2, 3, 4, 5];
    for (const day of days) {
      await prisma.availabilitySlot.create({
        data: {
          teacherId: teacher.id,
          dayOfWeek: day,
          startHour: 9 + (day % 3),
          startMin: 0,
          duration: 45,
          timezone: "UTC",
        },
      });
      await prisma.availabilitySlot.create({
        data: {
          teacherId: teacher.id,
          dayOfWeek: day,
          startHour: 14 + (day % 2),
          startMin: 0,
          duration: 45,
          timezone: "UTC",
        },
      });
    }
  }
}
