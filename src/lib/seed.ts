import { teachers } from "@/data/teachers";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export async function seedAuthUsers() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || "admin@islamicacademy.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "academy2026";
  const portalEmail = process.env.PORTAL_EMAIL?.trim().toLowerCase() || "portal@islamicacademy.local";
  const portalPassword = process.env.PORTAL_PASSWORD || "academy2026";

  const existingUsers = await prisma.user.findMany({
    where: { email: { in: [adminEmail, portalEmail] } },
    select: { email: true },
  });
  const existingEmails = new Set(existingUsers.map((user) => user.email));

  if (!existingEmails.has(adminEmail)) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Admin User",
        passwordHash: await hashPassword(adminPassword),
        role: UserRole.ADMIN,
        emailVerified: new Date(),
      },
    });
  }

  if (!existingEmails.has(portalEmail)) {
    await prisma.user.create({
      data: {
        email: portalEmail,
        name: "Family Portal User",
        passwordHash: await hashPassword(portalPassword),
        role: UserRole.PARENT,
        emailVerified: new Date(),
      },
    });
  }
}

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
