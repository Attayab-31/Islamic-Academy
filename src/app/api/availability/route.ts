import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const weekdayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export async function GET() {
    const teachers = await prisma.teacher.findMany({
        include: { availability: true },
        orderBy: { name: "asc" },
    });

    const blocks = teachers.flatMap((teacher) =>
        teacher.availability.map((slot) => ({
            id: `${teacher.id}-${slot.dayOfWeek}-${slot.startHour}-${slot.startMin}`,
            teacherId: teacher.id,
            teacherName: teacher.name,
            dayOfWeek: slot.dayOfWeek,
            startHour: slot.startHour,
            startMin: slot.startMin,
            duration: slot.duration,
            capacity: slot.capacity,
            label: `${weekdayLabels[slot.dayOfWeek] ?? "Day"} ${String(slot.startHour).padStart(2, "0")}:${String(slot.startMin).padStart(2, "0")} (${slot.duration} min)`,
        }))
    );

    return NextResponse.json(blocks);
}
