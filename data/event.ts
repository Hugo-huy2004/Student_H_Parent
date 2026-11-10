/**
 * Ngày giờ buổi lễ, đọc từ biến môi trường (xem .env.example):
 *   EVENT_DATE=2026-11-20   (YYYY-MM-DD)
 *   EVENT_TIME=18:30        (HH:mm, 24 giờ)
 * Bỏ trống → dùng ngày giờ theo key visual (17.11.2026, 18:00).
 * Giá trị được đọc lúc build trang, đổi giá trị thì cần build / deploy lại.
 */

export type EventDate = { day: string; month: string; year: string; daysInMonth: number };
export type EventTime = { hour: string; minute: string };

const DEFAULT_YEAR = "2026";

function parseDate(raw: string | undefined): EventDate | null {
  const m = raw?.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const [, y, mo, d] = m;
  const daysInMonth = new Date(+y, +mo, 0).getDate();
  if (+mo < 1 || +mo > 12 || +d < 1 || +d > daysInMonth) return null;
  return { day: d, month: mo, year: y, daysInMonth };
}

function parseTime(raw: string | undefined): EventTime | null {
  const m = raw?.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m || +m[1] > 23 || +m[2] > 59) return null;
  return { hour: m[1].padStart(2, "0"), minute: m[2] };
}

export function getEventSchedule() {
  const date = parseDate(process.env.EVENT_DATE || "2026-11-17");
  const time = parseTime(process.env.EVENT_TIME || "18:00");
  return {
    date,
    time,
    year: date?.year ?? DEFAULT_YEAR,
    daysInMonth: date?.daysInMonth ?? 31,
  };
}

/**
 * Địa điểm, đọc từ biến môi trường (xem .env.example):
 *   EVENT_VENUE=Tên nơi tổ chức
 *   EVENT_ADDRESS=Số nhà, đường, phường, thành phố
 * Bỏ trống → dùng địa điểm theo key visual (Hall of Greenwich Vietnam).
 */
export function getEventVenue() {
  const name = process.env.EVENT_VENUE?.trim() || "Hall of Greenwich Vietnam";
  if (!name) return null;
  const address = process.env.EVENT_ADDRESS?.trim() || "20 Cộng Hòa, Phường Bảy Hiền, TP. Hồ Chí Minh";
  return {
    name,
    address,
    map: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(`${name}, ${address}`),
  };
}
