import { getEventSchedule, getEventVenue } from "@/data/event";
import { buildIcs } from "@/lib/calendar";

/** /calendar.ics — sự kiện lịch; chỉ có khi EVENT_DATE + EVENT_TIME đã đặt (đọc lúc build). */
export function GET() {
  const { date, time } = getEventSchedule();
  if (!date || !time) return new Response("Chưa có ngày giờ chính thức", { status: 404 });
  return new Response(buildIcs({ date, time, venue: getEventVenue() }), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="student-honoring-ceremony.ics"',
    },
  });
}
