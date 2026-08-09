import { PrismaClient } from "@prisma/client";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME ?? "Administrator";
  const portalEmail = process.env.PORTAL_EMAIL?.trim().toLowerCase();
  const portalPassword = process.env.PORTAL_PASSWORD;
  const portalName = process.env.PORTAL_NAME ?? "Family Portal User";
  const teacherEmail = process.env.TEACHER_EMAIL?.trim().toLowerCase();
  const teacherPassword = process.env.TEACHER_PASSWORD;
  const teacherName = process.env.TEACHER_NAME ?? "Teacher User";

  if (!adminEmail || !adminPassword) {
    console.warn("Skipping admin seed: set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
    return;
  }

  const adminHash = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminHash,
      name: adminName,
      role: UserRole.ADMIN,
    },
    create: {
      email: adminEmail,
      passwordHash: adminHash,
      name: adminName,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  });

  if (portalEmail && portalPassword) {
    const portalHash = await bcrypt.hash(portalPassword, 12);
    await prisma.user.upsert({
      where: { email: portalEmail },
      update: {
        passwordHash: portalHash,
        name: portalName,
        role: UserRole.PARENT,
      },
      create: {
        email: portalEmail,
        passwordHash: portalHash,
        name: portalName,
        role: UserRole.PARENT,
        emailVerified: new Date(),
      },
    });
  }

  if (teacherEmail && teacherPassword) {
    const teacherHash = await bcrypt.hash(teacherPassword, 12);
    await prisma.user.upsert({
      where: { email: teacherEmail },
      update: {
        passwordHash: teacherHash,
        name: teacherName,
        role: UserRole.TEACHER,
      },
      create: {
        email: teacherEmail,
        passwordHash: teacherHash,
        name: teacherName,
        role: UserRole.TEACHER,
        emailVerified: new Date(),
      },
    });
  }

  console.log(`Seeded users: ${adminEmail}${portalEmail ? `, ${portalEmail}` : ""}${teacherEmail ? `, ${teacherEmail}` : ""}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
