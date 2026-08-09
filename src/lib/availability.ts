export type ParsedRecurringSlot = {
    dayOfWeek: number;
    startHour: number;
    startMin: number;
    duration: number;
    capacity: number;
};

export type AvailabilityConflict = {
    dayOfWeek: number;
    startHour: number;
    startMin: number;
    duration: number;
};

const weekdayMap: Record<string, number> = {
    sun: 0,
    sunday: 0,
    mon: 1,
    monday: 1,
    tue: 2,
    tuesday: 2,
    wed: 3,
    wednesday: 3,
    thu: 4,
    thursday: 4,
    fri: 5,
    friday: 5,
    sat: 6,
    saturday: 6,
};

function normalizeDay(raw: string) {
    return weekdayMap[raw.trim().toLowerCase()];
}

function parseTime(value: string) {
    const cleaned = value.trim().toLowerCase();
    const meridiem = cleaned.endsWith("am") || cleaned.endsWith("pm");
    let base = cleaned.replace(/(am|pm)$/i, "").trim();
    let [hourRaw, minuteRaw] = base.split(":");
    let hour = Number(hourRaw);
    let minute = minuteRaw ? Number(minuteRaw) : 0;

    if (Number.isNaN(hour)) {
        return null;
    }

    if (meridiem) {
        if (cleaned.endsWith("pm") && hour < 12) hour += 12;
        if (cleaned.endsWith("am") && hour === 12) hour = 0;
    }

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        return null;
    }

    return { hour, minute };
}

export function findConflictingSlots(existing: Array<Pick<AvailabilityConflict, "dayOfWeek" | "startHour" | "startMin" | "duration">>, proposed: Array<Pick<AvailabilityConflict, "dayOfWeek" | "startHour" | "startMin" | "duration">>) {
    return proposed.filter((slot) => {
        return existing.some((existingSlot) => {
            if (existingSlot.dayOfWeek !== slot.dayOfWeek) {
                return false;
            }

            const existingStart = existingSlot.startHour * 60 + existingSlot.startMin;
            const existingEnd = existingStart + existingSlot.duration;
            const proposedStart = slot.startHour * 60 + slot.startMin;
            const proposedEnd = proposedStart + slot.duration;

            return proposedStart < existingEnd && proposedEnd > existingStart;
        });
    });
}

export function collectAvailabilitySlotInputs(selectedDays: string[], values: Record<string, string | FormDataEntryValue | undefined>) {
    return selectedDays.flatMap((dayValue) => {
        const dayOfWeek = Number(dayValue);
        const startHourRaw = values[`startHour_${dayOfWeek}`];
        const startMinRaw = values[`startMin_${dayOfWeek}`];
        const durationRaw = values[`duration_${dayOfWeek}`];
        const startHour = Number(typeof startHourRaw === "string" ? startHourRaw : startHourRaw?.toString());
        const startMin = Number(typeof startMinRaw === "string" ? startMinRaw : startMinRaw?.toString() ?? "0");
        const duration = Number(typeof durationRaw === "string" ? durationRaw : durationRaw?.toString() ?? "45");

        if (Number.isNaN(startHour) || duration <= 0) {
            return [];
        }

        return [{
            dayOfWeek,
            startHour,
            startMin,
            duration,
        }];
    });
}

export function parseRecurringSlots(input: string): ParsedRecurringSlot[] {
    const lines = input
        .split(/\n|;/)
        .map((line) => line.trim())
        .filter(Boolean);

    return lines.flatMap((line) => {
        const match = line.match(/^(mon|tue|wed|thu|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+(.+)$/i);
        if (!match) return [];

        const [, weekday, remainder] = match;
        const dayOfWeek = normalizeDay(weekday);
        if (dayOfWeek === undefined) return [];

        const capacityMatch = remainder.match(/capacity\s*[:=]\s*(\d+)/i);
        const capacity = capacityMatch ? Number(capacityMatch[1]) : 10;
        const withoutCapacity = remainder.replace(/\s*capacity\s*[:=]\s*\d+/i, "").trim();

        const timeMatch = withoutCapacity.match(/^(\d{1,2}(?::\d{2})?(?:am|pm)?)[\s-]+(\d{1,2}(?::\d{2})?(?:am|pm)?)$/i);
        if (!timeMatch) return [];

        const start = parseTime(timeMatch[1]);
        const end = parseTime(timeMatch[2]);
        if (!start || !end) return [];

        const durationMinutes = (end.hour * 60 + end.minute) - (start.hour * 60 + start.minute);
        if (durationMinutes <= 0) return [];

        return [{
            dayOfWeek,
            startHour: start.hour,
            startMin: start.minute,
            duration: durationMinutes,
            capacity,
        }];
    });
}
