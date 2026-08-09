import { prisma } from "@/lib/prisma";

export async function deleteTeacherAndLogin(teacherId: string) {
    const teacher = await prisma.teacher.findUnique({
        where: { id: teacherId },
        include: { user: true },
    });

    if (!teacher) return false;

    await prisma.$transaction(async (tx) => {
        await tx.booking.updateMany({
            where: { teacherId },
            data: { teacherId: null },
        });

        await tx.enrollment.updateMany({
            where: { teacherId },
            data: { teacherId: null },
        });

        await tx.availabilitySlot.deleteMany({
            where: { teacherId },
        });

        await tx.teacher.delete({
            where: { id: teacherId },
        });

        if (teacher.userId) {
            await tx.user.delete({
                where: { id: teacher.userId },
            });
        }
    });

    return true;
}
