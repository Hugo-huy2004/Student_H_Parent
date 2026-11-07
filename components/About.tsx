import Image, { type StaticImageData } from "next/image";
import tef from "@/public/awards/tef-gold.png";
import ua from "@/public/awards/university-alliance.png";
import studentCrowd from "@/public/awards/studentcrowd-top5-london.png";
import { Backdrop, campus } from "./Backdrop";
import { CountUp, Reveal, ScrollTrack, Scrub } from "./motion";

type Award = {
  id: string;
  /** Logo chính thức (tải từ gre.ac.uk). Không có → vẽ huy chương. */
  logo?: StaticImageData;
  alt: string;
  title: string;
  vi: string;
  en: string;
};

const AWARDS: Award[] = [
  {
    id: "queens",
    alt: "",
    title: "Queen’s Anniversary Prize",
    vi: "4 lần nhận Giải thưởng Kỷ niệm của Nữ hoàng, vinh dự cao nhất của Hoàng gia Anh dành cho các trường đại học.",
    en: "Four-time winner of the Queen’s Anniversary Prize, the UK’s highest royal honour for a university.",
  },
  {
    id: "tef",
    logo: tef,
    alt: "TEF 2023 Gold",
    title: "TEF 2023 · Gold",
    vi: "Xếp hạng Vàng, mức cao nhất của Khung đánh giá Chất lượng Giảng dạy (TEF) tại Vương quốc Anh.",
    en: "Gold, the highest rating in the UK’s Teaching Excellence Framework.",
  },
  {
    id: "ua",
    logo: ua,
    alt: "University Alliance",
    title: "University Alliance",
    vi: "Thành viên liên minh các trường đại học chuyên nghiệp và kỹ thuật của Vương quốc Anh.",
    en: "Member of the alliance of the UK’s professional and technical universities.",
  },
  {
    id: "studentcrowd",
    logo: studentCrowd,
    alt: "StudentCrowd 2026 — #5 Best Universities in London",
    title: "StudentCrowd 2026",
    vi: "Top 5 trường đại học tốt nhất London, bình chọn từ đánh giá của chính sinh viên.",
    en: "#5 Best University in London, voted on by students’ own reviews.",
  },
];

const FACTS = [
  { big: "1890", vi: "Thành lập tại London", en: "Founded in London" },
  { big: "UNESCO", vi: "Khuôn viên Di sản Thế giới", en: "World Heritage campus" },
  { big: "UK", vi: "Bằng cấp Vương quốc Anh", en: "British degree" },
];

/** Huy chương vẽ tay cho giải không có logo tải được (Queen's Anniversary Prize). */
function RoyalMedal() {
  return (
    <svg className="medal" viewBox="0 0 200 200" aria-hidden>
      <defs>
        <path id="ring-queens" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
        <radialGradient id="glow-queens" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="97" className="medal-edge" />
      <circle cx="100" cy="100" r="92" className="medal-edge thin" />
      <g className="medal-spin">
        <text className="medal-ring">
          <textPath href="#ring-queens" textLength={500} lengthAdjust="spacing">
            QUEEN’S ANNIVERSARY PRIZE · HIGHER EDUCATION ·
          </textPath>
        </text>
      </g>
      <circle cx="100" cy="100" r="66" fill="url(#glow-queens)" className="medal-edge" />
      {/* vương miện đơn giản */}
      <path className="medal-crown" d="M78 84 l6 -20 l10 12 l6 -16 l6 16 l10 -12 l6 20 z" />
      <text x="100" y="124" className="medal-main">×4</text>
      <text x="100" y="146" className="medal-sub">ROYAL HONOUR</text>
    </svg>
  );
}

/** Giới thiệu nhà trường: đoạn mở, con số, dải giải thưởng chạy ngang theo cuộn. */
export default function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <Backdrop src={campus.domesNight} position="center 50%" />

      {/* tiêu đề "tiến lại gần" theo cuộn */}
      <Scrub scale={[0.78, 1]} y={[60, 0]} opacity={[0.2, 1]}>
        <Reveal as="p" className="kicker-label">
          Về nhà trường · About the University
        </Reveal>
        <Reveal as="h2" id="about-title" className="about-title" delay={0.1}>
          Đại học Greenwich
          <span className="en" lang="en">University of Greenwich</span>
        </Reveal>
      </Scrub>
      <Reveal as="p" className="about-text" delay={0.2}>
        Thành lập năm 1890 tại London, Đại học Greenwich có khuôn viên chính nằm trong quần thể Maritime
        Greenwich, Di sản Thế giới UNESCO. Tại Việt Nam, chương trình được triển khai cùng Tổ chức Giáo dục
        FPT, sinh viên nhận bằng do Đại học Greenwich (Vương quốc Anh) cấp.
        <span className="en" lang="en">
          Founded in London in 1890 and set within Maritime Greenwich, a UNESCO World Heritage Site. In
          Vietnam it partners with FPT Education; graduates receive a University of Greenwich (UK) degree.
        </span>
      </Reveal>

      <ul className="facts">
        {FACTS.map((f, i) => (
          <Reveal as="li" key={f.big} delay={0.1 * i}>
            <strong>{/^\d+$/.test(f.big) ? <CountUp from={1800} to={+f.big} /> : f.big}</strong>
            <span>{f.vi}</span>
            <span className="en" lang="en">{f.en}</span>
          </Reveal>
        ))}
      </ul>

      <Reveal as="p" className="kicker-label awards-label">
        Giải thưởng &amp; Ghi nhận · Awards &amp; Recognition
      </Reveal>
      <ScrollTrack className="awards">
        {AWARDS.map((a) => (
          <li key={a.id} className="award">
            <div className={`award-logo award-logo-${a.id}`}>
              {a.logo ? <Image src={a.logo} alt={a.alt} sizes="240px" /> : <RoyalMedal />}
            </div>
            <h3 className="award-title">{a.title}</h3>
            <p className="award-note">
              {a.vi}
              <span className="en" lang="en">{a.en}</span>
            </p>
          </li>
        ))}
      </ScrollTrack>
    </section>
  );
}
