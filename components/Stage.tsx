// Đèn chiếu + ruy băng vàng phủ lên nền (theo key visual Student Honoring Ceremony).
// Toàn bộ là CSS/SVG, không dùng ảnh.

const GOLD_STOPS = (
  <>
    <stop offset="0%" stopColor="#fff4cf" />
    <stop offset="30%" stopColor="#f0cf7d" />
    <stop offset="55%" stopColor="#b8862f" />
    <stop offset="75%" stopColor="#f6dd95" />
    <stop offset="100%" stopColor="#9d6d22" />
  </>
);

function Ribbon({ className }: { className: string }) {
  return (
    <svg className={`ribbon ${className}`} viewBox="0 0 80 40" aria-hidden>
      <defs>
        <linearGradient id={`g-${className}`} x1="0" y1="0" x2="1" y2="1">
          {GOLD_STOPS}
        </linearGradient>
      </defs>
      <path
        d="M4 30 C 18 4, 30 4, 36 18 S 56 38, 76 8"
        fill="none"
        stroke={`url(#g-${className})`}
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Lớp trang trí phủ trên ảnh nền: đèn chiếu mờ + ruy băng vàng bay */
export default function Stage() {
  return (
    <div className="stage" aria-hidden>
      <div className="beam beam-1" />
      <div className="beam beam-2" />
      <div className="beam beam-3" />
      <Ribbon className="r1" />
      <Ribbon className="r2" />
      <Ribbon className="r3" />
      <Ribbon className="r4" />
    </div>
  );
}
