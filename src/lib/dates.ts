export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function setHours(date: Date, hours: number) {
  const result = new Date(date);
  result.setHours(hours);
  return result;
}

export function setMinutes(date: Date, minutes: number) {
  const result = new Date(date);
  result.setMinutes(minutes);
  return result;
}

export function format(date: Date, pattern: string) {
  const map: Record<string, string> = {
    EEE: date.toLocaleDateString("en-US", { weekday: "short" }),
    MMM: date.toLocaleDateString("en-US", { month: "short" }),
    d: String(date.getDate()),
    h: String(date.getHours() % 12 || 12),
    mm: String(date.getMinutes()).padStart(2, "0"),
    a: date.getHours() >= 12 ? "PM" : "AM",
  };

  return pattern
    .replace("EEE", map.EEE)
    .replace("MMM", map.MMM)
    .replace("d", map.d)
    .replace("h:mm a", `${map.h}:${map.mm} ${map.a}`);
}

export function generateIcsEvent(params: {
  title: string;
  description: string;
  start: Date;
  end: Date;
  location: string;
}) {
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Islamic Academy//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@islamic-academy`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(params.start)}`,
    `DTEND:${fmt(params.end)}`,
    `SUMMARY:${params.title}`,
    `DESCRIPTION:${params.description}`,
    `LOCATION:${params.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
