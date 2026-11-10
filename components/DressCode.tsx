import DressFilm from "./DressFilm";
import { Reveal } from "./motion";

/** Trang phục buổi lễ: Xanh dương – Trắng, trang trọng buổi tối. */

const PALETTE = [
  { hex: "#0b3fb0", vi: "Xanh hoàng gia", en: "Royal blue", role: "Chủ đạo · Main" },
  { hex: "#0a1f5c", vi: "Xanh navy", en: "Navy", role: "Chủ đạo · Main" },
  { hex: "#8db6f2", vi: "Xanh da trời", en: "Sky blue", role: "Phối · Accent" },
  { hex: "#ffffff", vi: "Trắng", en: "White", role: "Chủ đạo · Main" },
  { hex: "#c9d3e6", vi: "Bạc", en: "Silver", role: "Phụ kiện · Details" },
];

const AVOID = [
  { hex: "#d7263d", label: "Đỏ" },
  { hex: "#f28c28", label: "Cam" },
  { hex: "#f5c518", label: "Vàng" },
  { hex: "#39ff14", label: "Neon" },
];

const SKIN = "#ecd5c3";
const HAIR = "#2b2233";

/** Nam: vest xanh navy + sơ mi trắng + cà vạt bạc */
function Suit() {
  return (
    <svg viewBox="0 0 120 260" aria-hidden>
      <circle cx="60" cy="30" r="17" fill={SKIN} />
      <path d="M43 26q2-16 17-16t17 14q-8-6-17-6t-17 8Z" fill={HAIR} />
      <rect x="54" y="45" width="12" height="10" fill={SKIN} />
      {/* quần */}
      <path d="M38 140h44l-4 100h-14l-4-82-4 82H42Z" fill="#0a1f5c" />
      <path d="M40 238h18v8H36Zm22 0h18l4 8H62Z" fill="#111" />
      {/* áo vest */}
      <path d="M30 62q12-8 30-8t30 8l6 90H24Z" fill="#0a1f5c" />
      <path d="M60 56 47 58l13 50 13-50Z" fill="#fff" />
      <path d="M57 62h6l2 40-5 8-5-8Z" fill="#c9d3e6" />
      <path d="M47 58 60 108 50 72l-6-4Zm26 0L60 108l10-36 6-4Z" fill="#14307f" />
      <path d="M24 152 20 70q2-6 10-8l4 88Zm72 0 4-82q-2-6-10-8l-4 88Z" fill="#0d2670" />
      <circle cx="60" cy="122" r="1.8" fill="#c9d3e6" />
      <path d="M74 80h9l-1 4h-8Z" fill="#fff" />
    </svg>
  );
}

/** Nữ: đầm dài xanh hoàng gia, đai bạc */
function Gown() {
  return (
    <svg viewBox="0 0 120 260" aria-hidden>
      <path d="M40 34q0-24 20-24t20 24l2 34H38Z" fill={HAIR} />
      <circle cx="60" cy="32" r="16" fill={SKIN} />
      <rect x="55" y="46" width="10" height="10" fill={SKIN} />
      <path d="M44 58q16 6 32 0l3 10-6 4H47l-6-4Z" fill={SKIN} />
      <path d="M44 66h32l-3 46H47Z" fill="#0b3fb0" />
      <path d="M44 66q16 10 32 0" fill="none" stroke="#3d6fd6" strokeWidth="2" />
      <rect x="46" y="108" width="28" height="6" rx="2" fill="#c9d3e6" />
      <path d="M47 114h26l27 132H20Z" fill="#0b3fb0" />
      <path d="M60 114 52 246h-8Zm0 0 16 132h-8Z" fill="#1a52c8" />
      <path d="M41 68q-8 20-6 44l5 1q0-24 6-40Zm38 0q8 20 6 44l-5 1q0-24-6-40Z" fill={SKIN} />
    </svg>
  );
}

/** Áo dài xanh da trời + quần trắng */
function AoDai() {
  return (
    <svg viewBox="0 0 120 260" aria-hidden>
      <path d="M42 30q0-20 18-20t18 20v6H42Z" fill={HAIR} />
      <path d="M72 26q12 20 4 60l-6-2q6-30-2-52Z" fill={HAIR} />
      <circle cx="60" cy="32" r="16" fill={SKIN} />
      {/* quần trắng ống rộng */}
      <path d="M44 150h32l8 96H64l-4-80-4 80H36Z" fill="#fff" />
      {/* thân áo + hai tà dài */}
      <path d="M60 48q-12 0-16 6l-4 96 14 92h12l14-92-4-96q-4-6-16-6Z" fill="#8db6f2" />
      <path d="M56 48h8v8h-8Z" fill="#8db6f2" stroke="#5e8fdc" />
      <path d="M44 56q-8 4-10 18l-4 60 6 1 6-58Zm32 0q8 4 10 18l4 60-6 1-6-58Z" fill="#7aa6ea" />
      <path d="M48 140h24" stroke="#5e8fdc" strokeWidth="1.5" />
      <path d="M58 60q-6 10-6 30" fill="none" stroke="#c9d3e6" strokeWidth="1.2" />
    </svg>
  );
}

const LOOKS = [
  { Art: Suit, vi: "Vest xanh navy · sơ mi trắng", en: "Navy suit, white shirt" },
  { Art: Gown, vi: "Đầm dài xanh hoàng gia", en: "Royal-blue evening dress" },
  { Art: AoDai, vi: "Áo dài xanh · quần trắng", en: "Blue áo dài, white trousers" },
];

export default function DressCode() {
  return (
    <section className="dress" aria-labelledby="dress-title">
      <span className="star-slot star-slot-corner-l" data-star aria-hidden />
      <Reveal as="p" className="kicker">
        Trang phục
        <span className="en" lang="en">Dress code</span>
      </Reveal>
      <Reveal as="h2" id="dress-title" className="dress-title gold shine" delay={0.1}>
        Blue – White
      </Reveal>
      <Reveal as="p" className="dress-level" delay={0.15}>
        Trang trọng buổi tối · <span lang="en">Formal evening</span>
      </Reveal>

      {/* Phim hướng dẫn: cuộn tới tự phóng toàn màn hình, phải xem hết */}
      <DressFilm />

      {/* Minh hoạ phối đồ */}
      <ul className="dress-looks">
        {LOOKS.map(({ Art, vi, en }, i) => (
          <Reveal as="li" key={vi} delay={0.1 + i * 0.12}>
            <Art />
            <span>
              {vi}
              <span className="en" lang="en">{en}</span>
            </span>
          </Reveal>
        ))}
      </ul>

      {/* Bảng màu */}
      <Reveal as="div" className="dress-block" delay={0.1}>
        <h3>Bảng màu <span lang="en">· Colour palette</span></h3>
        <ul className="dress-palette">
          {PALETTE.map((c) => (
            <li key={c.hex}>
              <i style={{ background: c.hex }} />
              <strong>{c.vi}</strong>
              <span lang="en">{c.en}</span>
              <small>{c.role}</small>
            </li>
          ))}
        </ul>
        <p className="dress-ratio">
          Chọn <b>xanh</b> hoặc <b>trắng</b> làm màu chính (khoảng 70%), phối màu còn lại; điểm xuyết phụ kiện bạc.
          <span className="en" lang="en">Wear blue or white as the main colour (about 70%), paired with the other; silver for details.</span>
        </p>
      </Reveal>

      {/* Nên / Tránh */}
      <div className="dress-rules">
        <Reveal as="div" className="dress-block dress-do" delay={0.1}>
          <h3>Nên <span lang="en">· Do</span></h3>
          <ul>
            <li>Vest, suit hoặc sơ mi trắng + quần âu xanh đậm; cà vạt xanh / bạc.</li>
            <li>Đầm dài, đầm midi, áo dài hoặc set vest nữ tông xanh – trắng.</li>
            <li>Giày tây, giày cao gót hoặc giày búp bê lịch sự; phụ kiện bạc, ngọc trai.</li>
            <li>Chất liệu đứng form, phẳng phiu; trang phục chỉn chu, kín đáo.</li>
          </ul>
        </Reveal>
        <Reveal as="div" className="dress-block dress-dont" delay={0.2}>
          <h3>Tránh <span lang="en">· Avoid</span></h3>
          <ul className="dress-avoid" aria-label="Màu nên tránh">
            {AVOID.map((c) => (
              <li key={c.hex}>
                <i style={{ background: c.hex }} />
                {c.label}
              </li>
            ))}
          </ul>
          <ul>
            <li>Màu đỏ, cam, vàng, neon và hoạ tiết sặc sỡ lấn át tông xanh – trắng.</li>
            <li>Toàn bộ màu đen (đen chỉ nên dùng cho giày, thắt lưng).</li>
            <li>Đồ thể thao, quần short, áo thun in chữ, jeans rách, dép lê.</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
