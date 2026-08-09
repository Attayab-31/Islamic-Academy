import { addDays, format, setHours, setMinutes, startOfDay } from "./dates";

export { addDays, format, setHours, setMinutes, startOfDay };

export type TimeSlot = {
  id: string;
  teacherId: string;
  teacherName: string;
  start: Date;
  end: Date;
  label: string;
  enrolledStudents: number;
  capacity: number;
};

export function generateAvailableSlots(
  availability: {
    id: string;
    teacherId: string;
    teacherName: string;
    dayOfWeek: number;
    startHour: number;
    startMin: number;
    duration: number;
  }[],
  timezone: string,
  daysAhead = 14
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const now = new Date();

  for (let d = 0; d < daysAhead; d++) {
    const date = addDays(startOfDay(now), d);
    const dow = date.getDay();

    for (const a of availability) {
      if (a.dayOfWeek !== dow) continue;

      const start = setMinutes(setHours(date, a.startHour), a.startMin);
      if (start <= now) continue;

      const end = new Date(start.getTime() + a.duration * 60000);
      slots.push({
        id: `${a.teacherId}-${start.toISOString()}`,
        teacherId: a.teacherId,
        teacherName: a.teacherName,
        start,
        end,
        label: formatInTimezone(start, timezone),
        enrolledStudents: 0,
        capacity: 10,
      });
    }
  }

  return slots.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function filterUnavailableSlots(
  slots: TimeSlot[],
  bookings: Array<{ teacherId?: string | null; slotStart: Date | string; slotEnd: Date | string }>
): TimeSlot[] {
  void bookings;
  return slots;
}

function formatInTimezone(date: Date, timezone: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone,
    }).format(date);
  } catch {
    return format(date, "EEE MMM d, h:mm a");
  }
}
