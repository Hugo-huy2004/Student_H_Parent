/**
 * Sự kiện lịch cho nút "Thêm vào lịch": file .ics (iPhone / Android / Outlook) và link Google Calendar.
 * Giờ nhập theo giờ Việt Nam (UTC+7, không đổi giờ mùa hè) → đổi sang UTC.
 */

// ponytail: chưa có giờ kết thúc chính thức → mặc định 2 tiếng; có thì thêm EVENT_END vào data/event.ts
const DURATION_HOURS = 2;
const VN_OFFSET_HOURS = 7;

export type CalendarInput = {
  date: { day: string; month: string; year: string };
  time: { hour: string; minute: string };
  venue?: { name: string; address: string } | null;
};

const TITLE = "Student Honoring Ceremony · Lễ Tôn vinh Sinh viên Xuất sắc";
const DETAILS = "Summer 2026 Trimester — University of Greenwich (Vietnam). Honouring Lê Gia Huy (Petrus Hugo Wishpax Le).";

/** 20261120T113000Z */
function stamp(ms: number) {
  return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function range({ date, time }: CalendarInput) {
  const start = Date.UTC(+date.year, +date.month - 1, +date.day, +time.hour - VN_OFFSET_HOURS, +time.minute);
  return { start: stamp(start), end: stamp(start + DURATION_HOURS * 3600_000) };
}

const place = (v: CalendarInput["venue"]) => (v ? [v.name, v.address].filter(Boolean).join(", ") : "");

/** Thoát ký tự đặc biệt theo RFC 5545 */
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

export function buildIcs(input: CalendarInput) {
  const { start, end } = range(input);
  const location = place(input.venue);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Greenwich Vietnam//Student Honoring Ceremony//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:student-honoring-${start}@greenwich-invitation`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${esc(TITLE)}`,
    `DESCRIPTION:${esc(DETAILS)}`,
    ...(location ? [`LOCATION:${esc(location)}`] : []),
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(TITLE)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function googleCalendarUrl(input: CalendarInput) {
  const { start, end } = range(input);
  const q = new URLSearchParams({ action: "TEMPLATE", text: TITLE, dates: `${start}/${end}`, details: DETAILS });
  const location = place(input.venue);
  if (location) q.set("location", location);
  return `https://calendar.google.com/calendar/render?${q}`;
}
