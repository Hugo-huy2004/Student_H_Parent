import Image from "next/image";
import { getEventSchedule, getEventVenue } from "@/data/event";
import hugo from "@/public/Hugo.png";
import { Backdrop, HeroSlideshow, campus } from "./Backdrop";
import Stage from "./Stage";
import Reel from "./Reel";
import { googleCalendarUrl } from "@/lib/calendar";
import Music from "./Music";
import GoldDust from "./GoldDust";
import Fireworks from "./Fireworks";
import starPodium from "@/public/star-podium.png";
import Hero from "./Hero";
import About from "./About";
import { ArchPortrait, Reveal, ScrollProgress, Scrub, Words } from "./motion";

const HONOREE = "Lê Gia Huy";
/** Tên quốc tế do Huy tự chọn */
const HONOREE_INTL = "Petrus Hugo Wishpax Le";

/** Cành nguyệt quế vàng: lá xếp đôi dọc theo một đường cong (tính sẵn lúc render) */
function Laurel({ flip }: { flip?: boolean }) {
  // đường cong bậc 2 từ gốc (dưới) lên ngọn (trên)
  const P = [
    [44, 112],
    [2, 64],
    [30, 6],
  ];
  const at = (t: number) => {
    const u = 1 - t;
    return [0, 1].map((k) => u * u * P[0][k] + 2 * u * t * P[1][k] + t * t * P[2][k]);
  };
  const leaves = Array.from({ length: 8 }, (_, i) => {
    const t = 0.08 + i * 0.12;
    const [x, y] = at(t);
    const [x2, y2] = at(t + 0.01);
    const angle = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
    const size = 1 - t * 0.35;
    return [-38, 38].map((d) => ({ x, y, angle: angle + d, size }));
  }).flat();
  return (
    <svg className={`laurel ${flip ? "laurel-flip" : ""}`} viewBox="0 0 56 120" aria-hidden>
      <defs>
        <linearGradient id="laurel-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff4cf" />
          <stop offset="45%" stopColor="#e2b85f" />
          <stop offset="100%" stopColor="#a87628" />
        </linearGradient>
      </defs>
      <path d="M44 112 Q2 64 30 6" fill="none" stroke="url(#laurel-gold)" strokeWidth="1.6" strokeLinecap="round" />
      {leaves.map((l, i) => (
        <ellipse
          key={i}
          cx={0}
          cy={0}
          rx={9 * l.size}
          ry={3.4 * l.size}
          fill="url(#laurel-gold)"
          transform={`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.angle.toFixed(1)}) translate(${(8 * l.size).toFixed(1)} 0)`}
        />
      ))}
      <ellipse cx="30" cy="6" rx="3" ry="6" fill="url(#laurel-gold)" transform="rotate(20 30 6)" />
    </svg>
  );
}

const PinIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

const pad = (n: number) => String(n).padStart(2, "0");
const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => pad(from + i));
const HOURS = range(0, 23);
const MINUTES = range(0, 59);
const DAYS = range(1, 31);
const MONTHS = range(1, 12);

/** Một dòng tiếng Anh đi kèm dòng tiếng Việt */
const En = ({ children }: { children: React.ReactNode }) => (
  <span className="en" lang="en">
    {children}
  </span>
);

/** Thư mời chung gửi Quý Phụ huynh. */
export default function Invitation() {
  const { date, time } = getEventSchedule();
  const venue = getEventVenue();

  return (
    <main className="inv">
      <ScrollProgress />
      <Music />

      {/* ── 1. Bìa: Thư mời tham dự Lễ ... ──────────── */}
      <Hero>
        <HeroSlideshow />
        <Stage />
        <Fireworks every={1800} />
      </Hero>

      {/* ── 2. Về nhà trường + giải thưởng ─────────── */}
      <About />

      {/* ── 3. Kính mời ─────────────────────────────── */}
      <section className="greeting" aria-labelledby="greet-name">
        <Fireworks every={1400} />
        <Reveal as="p" className="kicker">
          Trân trọng kính mời
          <En>You are cordially invited</En>
        </Reveal>
        <Scrub scale={[0.6, 1]} opacity={[0, 1]} y={[40, 0]}>
          <Reveal as="h2" id="greet-name" className="greet-name gold shine" delay={0.15}>
            Quý Phụ huynh
          </Reveal>
        </Scrub>
        <Reveal as="p" className="greet-en" delay={0.2}>
          Dear Parents
        </Reveal>
        <Reveal className="divider" aria-hidden delay={0.25}>
          <span />
        </Reveal>
        <Reveal as="p" className="greet-to" delay={0.3}>
          đến dự
        </Reveal>
        <Reveal as="p" className="greet-event" delay={0.35}>
          Lễ Tôn vinh {"Sinh\u00a0viên Xuất\u00a0sắc"}
        </Reveal>
        <Reveal as="p" className="greet-event-en" delay={0.4}>
          Student Honoring Ceremony · Summer 2026
        </Reveal>
      </section>

      {/* ── 4. Vinh danh ────────────────────────────── */}
      <section id="honoree" className="honoree" aria-labelledby="honoree-name">
        <Backdrop src={campus.dome} position="center 30%" />
        <Scrub scale={[0.82, 1]} y={[80, 0]} opacity={[0.3, 1]}>
          <ArchPortrait>
            <Image src={hugo} alt="Lê Gia Huy (Hugo)" sizes="(max-width: 640px) 60vw, 300px" placeholder="blur" />
          </ArchPortrait>
        </Scrub>
        <Words id="honoree-name" className="honoree-name" text={HONOREE} />
        <Reveal as="p" className="honoree-intl" lang="en" delay={0.15}>
          {HONOREE_INTL}
        </Reveal>
        <Reveal className="laurel-badge" delay={0.2}>
          <Laurel />
          <p className="badge">
            Sinh viên Xuất sắc <En>Outstanding Student</En>
          </p>
          <Laurel flip />
        </Reveal>
        <Reveal as="p" className="honoree-note" delay={0.3}>
          Được Nhà trường vinh danh trong Danh sách Sinh viên Xuất sắc kỳ Summer 2026.
          <En>Honoured by the University on the Outstanding Student List, Summer 2026.</En>
        </Reveal>
      </section>

      {/* ── 5. Thông tin buổi lễ ────────────────────────────── */}
      <section className="invite" aria-labelledby="details-title">
        <h2 id="details-title" className="sr-only">Thời gian và địa điểm · Date, time and venue</h2>

        <GoldDust />
        {/* chiếc cúp bay lên, xoay về thẳng, lớn dần theo cuộn */}
        <Scrub scale={[0.55, 1]} y={[160, 0]} rotate={[-14, 0]} opacity={[0, 1]}>
          <Reveal className="podium" delay={0.1}>
            <Image src={starPodium} alt="" sizes="(max-width: 640px) 70vw, 320px" />
          </Reveal>
        </Scrub>

        {/* Chỉ con số: giờ to, ngày nhỏ hơn — chưa chốt thì quay liên tục kiểu xổ số */}
        <Scrub y={[70, 0]} scale={[0.9, 1]}>
          <Reveal className="when-time" delay={0.15}>
            <span className="slot"><Reel items={HOURS} value={time?.hour} loopSeconds={2.4} /></span>
            <span className="when-colon">:</span>
            <span className="slot"><Reel items={MINUTES} value={time?.minute} loopSeconds={4.2} offset={0.6} /></span>
          </Reveal>
        </Scrub>
        <Reveal className="when-date" delay={0.25}>
          <Reel items={DAYS} value={date?.day} loopSeconds={3.1} offset={0.3} />
          <span className="when-sep">.</span>
          <Reel items={MONTHS} value={date?.month} loopSeconds={1.6} offset={0.9} />
          <span className="when-sep">.</span>
          <span>{date?.year ?? "2026"}</span>
        </Reveal>
        <p className="sr-only">
          {date ? `Ngày ${+date.day}/${+date.month}/${date.year}` : "Ngày chưa xác định"}
          {time ? `, lúc ${time.hour}:${time.minute}` : ", giờ chưa xác định"}
        </p>
        {(!date || !time) && (
          <Reveal as="p" className="when-note" delay={0.3}>
            Sẽ thông báo sau · To be announced
          </Reveal>
        )}

        <Reveal as="p" className="when-venue" delay={0.35}>
          <span className="when-pin"><PinIcon /></span>
          {venue ? (
            <span>
              <strong>{venue.name}</strong>
              {venue.address && <span className="when-addr">{venue.address}</span>}
            </span>
          ) : (
            <span>Sẽ thông báo sau</span>
          )}
        </Reveal>

        {date && time && (
          <Reveal className="cal" delay={0.4}>
            <a className="btn" href="/calendar.ics">
              Thêm vào lịch · Add to calendar
            </a>
            <a className="cal-alt" href={googleCalendarUrl({ date, time, venue })} target="_blank" rel="noreferrer">
              hoặc Google Calendar
            </a>
          </Reveal>
        )}

        {venue && (
          <Reveal as="a" className="btn" href={venue.map} target="_blank" rel="noreferrer" delay={0.4}>
            Xem chỉ đường · Directions
            <svg viewBox="0 0 16 16" aria-hidden><path d="M4 12 12 4M6 4h6v6" /></svg>
          </Reveal>
        )}
      </section>

      {/* ── 6. Lời kết ──────────────────────────────── */}
      <section className="closing">
        <Backdrop src={campus.colonnade} position="center 40%" />
        <Scrub scale={[0.8, 1]} opacity={[0, 1]}>
          <Reveal as="p" className="closing-line">
            Trân trọng cảm ơn
            <En>With sincere thanks</En>
          </Reveal>
        </Scrub>
        <Reveal as="p" className="signature" delay={0.25}>
          {HONOREE}
          <span className="signature-intl" lang="en">{HONOREE_INTL}</span>
        </Reveal>
        <footer className="foot">
          <span>University of Greenwich · Việt Nam</span>
          <span>Summer 2026</span>
        </footer>
      </section>
    </main>
  );
}
