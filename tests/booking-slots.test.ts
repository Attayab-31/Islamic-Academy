import test from "node:test";
import assert from "node:assert/strict";
import { filterUnavailableSlots } from "../src/lib/booking";

test("keeps a slot available even when the same time already has bookings", () => {
    const slots = [
        {
            id: "slot-1",
            teacherId: "teacher-1",
            teacherName: "Teacher A",
            start: new Date("2026-08-10T14:00:00.000Z"),
            end: new Date("2026-08-10T14:45:00.000Z"),
            label: "Mon",
            enrolledStudents: 0,
            capacity: 10,
        },
    ];

    const bookings = [
        {
            teacherId: "teacher-1",
            slotStart: new Date("2026-08-10T14:00:00.000Z"),
            slotEnd: new Date("2026-08-10T14:45:00.000Z"),
        },
        {
            teacherId: "teacher-1",
            slotStart: new Date("2026-08-10T14:10:00.000Z"),
            slotEnd: new Date("2026-08-10T14:55:00.000Z"),
        },
    ];

    const available = filterUnavailableSlots(slots as any, bookings as any);
    assert.equal(available.length, 1);
});

test("keeps slots available when there are no bookings for that teacher", () => {
    const slots = [
        {
            id: "slot-1",
            teacherId: "teacher-1",
            teacherName: "Teacher A",
            start: new Date("2026-08-10T14:00:00.000Z"),
            end: new Date("2026-08-10T14:45:00.000Z"),
            label: "Mon",
            enrolledStudents: 0,
            capacity: 10,
        },
    ];

    const bookings = [
        {
            teacherId: "teacher-2",
            slotStart: new Date("2026-08-10T15:00:00.000Z"),
            slotEnd: new Date("2026-08-10T15:45:00.000Z"),
        },
    ];

    const available = filterUnavailableSlots(slots as any, bookings as any);
    assert.equal(available.length, 1);
});
