import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { didone, didoneVi, sans, script, serif } from "./fonts";
import { AoDai, Gown, Suit } from "./outfits";

/**
 * Phim hướng dẫn trang phục (dọc 1080×1920) cho Quý Phụ huynh.
 * Hình canh theo lời đọc ElevenLabs (public/voice/dresscode.mp3): mốc mỗi đoạn / mỗi câu phụ đề
 * lấy từ khoảng lặng trong file (ffmpeg silencedetect). Đổi file giọng → đo lại và sửa SCENES / CAPTIONS.
 */

export const FPS = 30;
export const DURATION_S = 64;


const NIGHT = "#03124a";
const SILVER_TEXT: CSSProperties = {
  backgroundImage: "linear-gradient(180deg, #ffffff 0%, #dce6f7 26%, #8a98b6 50%, #f5f8fd 62%, #6c7b9c 86%, #e3e9f4 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

/** Mốc bắt đầu 7 đoạn (giây) + điểm kết thúc lời đọc */
const SCENES = [0, 7.73, 16.13, 26.14, 34.84, 42.63, 52.43, 62.0];

/** Phụ đề: [giây bắt đầu, câu] — mỗi câu hiện tới khi câu sau bắt đầu */
const CAPTIONS: [number, string][] = [
  [0.1, "Kính thưa Quý\u00a0Phụ\u00a0huynh."],
  [2.04, "Để buổi lễ thêm phần trang trọng,"],
  [4.12, "Nhà trường xin được gợi ý trang phục cho buổi tối hôm ấy."],
  [8.27, "Sắc màu chủ đạo của buổi lễ là… xanh dương và trắng."],
  [12.74, "Màu của bầu trời đêm…"],
  [14.37, "…và của ngôi sao pha lê."],
  [16.54, "Với các quý ông,"],
  [17.8, "xin mời chọn bộ vest xanh navy hoặc xanh dương đậm, phối cùng sơ mi trắng."],
  [22.95, "Cà vạt xanh hoặc màu bạc… sẽ thật lịch lãm."],
  [26.58, "Với các quý bà,"],
  [27.92, "một tà áo dài xanh hoặc trắng,"],
  [30.36, "hay một chiếc đầm dài thanh lịch tông xanh – trắng, đều rất phù hợp."],
  [35.16, "Phụ kiện màu bạc, ngọc trai,"],
  [37.6, "cùng đôi giày tây hoặc giày cao gót lịch sự,"],
  [40.36, "sẽ giúp tổng thể thêm hài hoà."],
  [43.07, "Xin Quý\u00a0Phụ\u00a0huynh vui lòng tránh những màu quá rực"],
  [47.24, "như đỏ, cam, vàng…"],
  [48.54, "cũng như trang phục thể thao, quần short hay dép lê."],
  [52.83, "Sự hiện diện chỉn chu của Quý\u00a0Phụ\u00a0huynh…"],
  [55.3, "chính là món quà ý nghĩa nhất dành cho các em."],
  [58.61, "Trân trọng cảm ơn,"],
  [59.86, "và hẹn gặp Quý\u00a0Phụ\u00a0huynh tại buổi lễ."],
];

const ease = (f: number, from: number, to: number) =>
  interpolate(f, [from, to], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });

/** Hiện lên (mờ → rõ, trượt nhẹ) tại giây `at` của cảnh */
function Rise({ at = 0, children, style, dist = 40 }: { at?: number; children: ReactNode; style?: CSSProperties; dist?: number }) {
  const f = useCurrentFrame();
  const k = ease(f, at * FPS, at * FPS + 24);
  return <div style={{ opacity: k, transform: `translateY(${(1 - k) * dist}px)`, ...style }}>{children}</div>;
}

/** Bầu trời sao lấp lánh nhẹ (cố định theo seed → render giống nhau mọi lần) */
function Sky() {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(90% 55% at 50% 42%, #1747b8 0%, #0a2a86 38%, ${NIGHT} 78%)`,
      }}
    >
      {Array.from({ length: 90 }, (_, i) => {
        const x = random(`x${i}`) * 1080;
        const y = random(`y${i}`) * 1920;
        const s = 2 + random(`s${i}`) * 4;
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(f / (18 + random(`p${i}`) * 30) + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: "50%",
              background: "#eaf2ff",
              opacity: tw * 0.8,
              boxShadow: `0 0 ${s * 3}px rgba(200,225,255,0.8)`,
            }}
          />
        );
      })}
      {/* đèn chiếu từ trên xuống */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "conic-gradient(from 180deg at 50% -5%, transparent 160deg, rgba(205,228,255,0.10) 175deg, rgba(205,228,255,0.18) 180deg, rgba(205,228,255,0.10) 185deg, transparent 200deg)",
        }}
      />
    </AbsoluteFill>
  );
}

/** Chiếc cúp pha lê: lơ lửng, nghiêng nhẹ, vệt sáng quét qua, quầng sáng thở */
function Star({ size, glow = 1 }: { size: number; glow?: number }) {
  const f = useCurrentFrame();
  const sweep = ((f % 120) / 120) * 260 - 80; // vệt sáng chạy ngang mỗi 4s
  const breathe = 0.85 + 0.15 * Math.sin(f / 22);
  return (
    <div style={{ position: "relative", width: size, height: size, transform: `translateY(${Math.sin(f / 28) * 10}px) rotate(${Math.sin(f / 50) * 4}deg)` }}>
      <div
        style={{
          position: "absolute",
          inset: "-30%",
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(225,238,255,0.75), rgba(120,170,255,0.25) 45%, transparent 75%)",
          opacity: glow * breathe,
        }}
      />
      {/* ảnh tạm cắt từ poster: làm mờ mép cho tan vào nền */}
      <Img
        src={staticFile("star.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          WebkitMaskImage: "radial-gradient(closest-side, #000 72%, transparent 100%)",
          maskImage: "radial-gradient(closest-side, #000 72%, transparent 100%)",
          filter: `brightness(${1 + 0.08 * Math.sin(f / 15)})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(105deg, transparent ${sweep - 12}%, rgba(255,255,255,0.55) ${sweep}%, transparent ${sweep + 12}%)`,
          mixBlendMode: "overlay",
          WebkitMaskImage: "radial-gradient(closest-side, #000 60%, transparent 90%)",
          maskImage: "radial-gradient(closest-side, #000 60%, transparent 90%)",
        }}
      />
    </div>
  );
}

const Chip = ({ children, at }: { children: ReactNode; at: number }) => (
  <Rise at={at} dist={24}>
    <div
      style={{
        padding: "22px 40px",
        borderRadius: 999,
        fontFamily: sans,
        fontWeight: 700,
        fontSize: 40,
        color: "#fff",
        background: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05))",
        boxShadow: "inset 0 0 0 2px rgba(205,228,255,0.45), 0 20px 40px -20px rgba(0,0,0,0.6)",
        textAlign: "center",
      }}
    >
      {children}
    </div>
  </Rise>
);

const SceneTitle = ({ vi, en, at = 0 }: { vi: string; en: string; at?: number }) => (
  <Rise at={at} style={{ textAlign: "center" }}>
    <div style={{ fontFamily: didoneVi, fontSize: 92, letterSpacing: "0.04em", textTransform: "uppercase", lineHeight: 1.05, ...SILVER_TEXT }}>{vi}</div>
    <div style={{ marginTop: 14, fontFamily: didone, fontSize: 30, letterSpacing: "0.3em", textTransform: "uppercase", color: "#8db6f2" }}>{en}</div>
  </Rise>
);

/** Khung cảnh: căn giữa vùng trên (chừa chỗ phụ đề ở dưới), mờ vào / mờ ra */
function Scene({ children, len }: { children: ReactNode; len: number }) {
  const f = useCurrentFrame();
  const o = Math.min(ease(f, 0, 18), 1 - ease(f, len * FPS - 6, len * FPS + 12));
  return (
    <AbsoluteFill style={{ opacity: o, alignItems: "center", justifyContent: "center", paddingBottom: 520, paddingTop: 400, gap: 40 }}>
      {children}
    </AbsoluteFill>
  );
}

/* ── 7 cảnh ── */

const S1 = () => (
  <>
    <Rise>
      <Star size={420} />
    </Rise>
    <Rise at={0.8} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: script, fontSize: 120, color: "#fff", lineHeight: 1 }}>Trang phục</div>
      <div style={{ marginTop: 20, fontFamily: didone, fontSize: 112, letterSpacing: "0.02em", lineHeight: 1, ...SILVER_TEXT }}>BLUE – WHITE</div>
      <div style={{ marginTop: 26, fontFamily: serif, fontStyle: "italic", fontSize: 44, color: "#e8eefa" }}>Trang trọng buổi tối · Formal evening</div>
    </Rise>
  </>
);

function S2() {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = spring({ frame: f - 10, fps, config: { damping: 18 } });
  const merge = ease(f, 4.4 * FPS, 6 * FPS); // "màu của bầu trời đêm… và ngôi sao pha lê"
  const disc = (bg: string, label: string, en: string, dir: number, ink: string) => (
    <div style={{ transform: `translateX(${dir * ((1 - k) * 500 + 40 * (1 - merge))}px)`, textAlign: "center" }}>
      <div
        style={{
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: bg,
          boxShadow: "inset 0 0 0 3px rgba(255,255,255,0.5), 0 40px 80px -30px rgba(0,0,0,0.7)",
          display: "grid",
          placeItems: "center",
          fontFamily: didoneVi,
          fontSize: 48,
          letterSpacing: "0.06em",
          color: ink,
        }}
      >
        {label}
      </div>
      <div style={{ marginTop: 24, fontFamily: didone, fontSize: 30, letterSpacing: "0.26em", textTransform: "uppercase", color: "#cfdcf3" }}>{en}</div>
    </div>
  );
  return (
    <>
      <SceneTitle vi="Màu chủ đạo" en="The colours" />
      <div style={{ display: "flex", gap: 0, alignItems: "flex-start", marginLeft: -40, marginRight: -40 }}>
        {disc("radial-gradient(circle at 35% 30%, #3f74e0, #0b3fb0 60%, #072a7a)", "Xanh dương", "Blue", -1, "#fff")}
        <div style={{ width: 200 * (1 - merge) + 40, display: "grid", placeItems: "center", alignSelf: "center", marginTop: -60 }}>
          <div style={{ opacity: merge, transform: `scale(${0.4 + 0.6 * merge})` }}>
            <Star size={300} glow={1.3} />
          </div>
        </div>
        {disc("radial-gradient(circle at 35% 30%, #ffffff, #eef3fb 60%, #c9d6ee)", "Trắng", "White", 1, NIGHT)}
      </div>
    </>
  );
}

/** Người mẫu minh hoạ đứng trên bục sáng */
function Figure({ children, w, h, at = 0 }: { children: ReactNode; w: number; h: number; at?: number }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const k = spring({ frame: f - at * FPS, fps, config: { damping: 16 } });
  return (
    <div style={{ position: "relative", width: w, height: h, opacity: k, transform: `translateY(${(1 - k) * 80}px) scale(${0.92 + 0.08 * k})` }}>
      <div
        style={{
          position: "absolute",
          left: "-20%",
          right: "-20%",
          bottom: -30,
          height: 90,
          borderRadius: "50%",
          background: "radial-gradient(closest-side, rgba(205,228,255,0.55), transparent)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 30px 30px rgba(0,0,30,0.5))" }}>{children}</div>
    </div>
  );
}

const S3 = () => (
  <>
    <SceneTitle vi="Quý ông" en="Gentlemen" />
    <Figure w={250} h={540} at={0.3}>
      <Suit />
    </Figure>
    <div style={{ display: "grid", gap: 20, justifyItems: "center" }}>
      <Chip at={1.7}>Vest xanh navy / xanh dương đậm</Chip>
      <Chip at={4.5}>Sơ mi trắng</Chip>
      <Chip at={6.8}>Cà vạt xanh hoặc màu bạc</Chip>
    </div>
  </>
);

const S4 = () => (
  <>
    <SceneTitle vi="Quý bà" en="Ladies" />
    <div style={{ display: "flex", gap: 90 }}>
      <Figure w={220} h={480} at={1.6}>
        <AoDai />
      </Figure>
      <Figure w={220} h={480} at={4.2}>
        <Gown />
      </Figure>
    </div>
    <div style={{ display: "grid", gap: 20, justifyItems: "center" }}>
      <Chip at={1.8}>Áo dài xanh hoặc trắng</Chip>
      <Chip at={4.3}>Đầm dài thanh lịch xanh – trắng</Chip>
    </div>
  </>
);

/** Chuỗi ngọc trai vẽ bằng các hạt tròn trên một cung */
function Pearls() {
  return (
    <svg viewBox="0 0 300 170" width={300} height={170}>
      {Array.from({ length: 19 }, (_, i) => {
        const a = Math.PI * (0.08 + (0.84 * i) / 18);
        return (
          <circle key={i} cx={150 - Math.cos(a) * 130} cy={20 + Math.sin(a) * 130} r={11} fill="url(#pearl)" />
        );
      })}
      <defs>
        <radialGradient id="pearl" cx="35%" cy="30%">
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.6" stopColor="#e6ecf6" />
          <stop offset="1" stopColor="#9aa8c4" />
        </radialGradient>
      </defs>
    </svg>
  );
}

const PALETTE: [string, string][] = [
  ["#0b3fb0", "Xanh hoàng gia"],
  ["#0a1f5c", "Xanh navy"],
  ["#8db6f2", "Xanh da trời"],
  ["#ffffff", "Trắng"],
  ["#c9d3e6", "Bạc"],
];

const S5 = () => (
  <>
    <SceneTitle vi="Phụ kiện" en="Details" />
    <Rise at={0.3}>
      <Pearls />
    </Rise>
    <Rise at={0.6} style={{ display: "flex", gap: 18 }}>
      {PALETTE.map(([c, name]) => (
        <div key={c} style={{ textAlign: "center", width: 140 }}>
          <div style={{ width: 120, height: 120, margin: "0 auto", borderRadius: "50%", background: c, boxShadow: "inset 0 0 0 3px rgba(255,255,255,0.4), 0 16px 30px -12px rgba(0,0,0,0.6)" }} />
          <div style={{ marginTop: 16, fontFamily: sans, fontWeight: 700, fontSize: 28, color: "#fff", lineHeight: 1.2 }}>{name}</div>
        </div>
      ))}
    </Rise>
    <div style={{ display: "grid", gap: 20, justifyItems: "center" }}>
      <Chip at={0.4}>Phụ kiện bạc · Ngọc trai</Chip>
      <Chip at={2.8}>Giày tây · Giày cao gót lịch sự</Chip>
    </div>
  </>
);

/** Ô màu nên tránh: hiện ra, rồi một nét gạch chéo nhẹ nhàng được vẽ qua */
function Avoid({ color, label, at }: { color: string; label: string; at: number }) {
  const f = useCurrentFrame();
  const cross = ease(f, (at + 0.5) * FPS, (at + 1.1) * FPS);
  return (
    <Rise at={at} style={{ textAlign: "center", width: 200 }}>
      <div style={{ position: "relative", width: 150, height: 150, margin: "0 auto" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color, opacity: 0.85 }} />
        <svg viewBox="0 0 150 150" style={{ position: "absolute", inset: -10, width: 170, height: 170 }}>
          <line x1="20" y1="20" x2={20 + 130 * cross} y2={20 + 130 * cross} stroke="#fff" strokeWidth="7" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ marginTop: 18, fontFamily: sans, fontWeight: 700, fontSize: 34, color: "#fff" }}>{label}</div>
    </Rise>
  );
}

function Struck({ children, at }: { children: ReactNode; at: number }) {
  const f = useCurrentFrame();
  const k = ease(f, (at + 0.4) * FPS, (at + 0.9) * FPS);
  return (
    <Rise at={at} dist={20} style={{ position: "relative", fontFamily: serif, fontSize: 52, color: "#e8eefa" }}>
      {children}
      <div style={{ position: "absolute", left: -8, top: "55%", height: 4, width: `calc(${k * 100}% + 16px)`, background: "#ff9b9b", borderRadius: 2 }} />
    </Rise>
  );
}

const S6 = () => (
  <>
    <SceneTitle vi="Xin tránh" en="Please avoid" />
    <div style={{ display: "flex", gap: 24 }}>
      <Avoid color="#d7263d" label="Đỏ" at={4.6} />
      <Avoid color="#f28c28" label="Cam" at={5.0} />
      <Avoid color="#f5c518" label="Vàng" at={5.4} />
    </div>
    <div style={{ display: "flex", gap: 56, marginTop: 20 }}>
      <Struck at={6.4}>Đồ thể thao</Struck>
      <Struck at={7.3}>Quần short</Struck>
      <Struck at={8.0}>Dép lê</Struck>
    </div>
  </>
);

const S7 = () => (
  <>
    <Rise>
      <Star size={440} glow={1.5} />
    </Rise>
    <Rise at={6.2} style={{ textAlign: "center" }}>
      <div style={{ fontFamily: script, fontSize: 130, color: "#fff", lineHeight: 1.1 }}>Trân trọng cảm ơn</div>
      <div style={{ marginTop: 34, fontFamily: didone, fontSize: 40, letterSpacing: "0.12em", ...SILVER_TEXT }}>18:00 · 17.11.2026</div>
      <div style={{ marginTop: 12, fontFamily: serif, fontStyle: "italic", fontSize: 40, color: "#e8eefa" }}>Hall of Greenwich Vietnam</div>
    </Rise>
  </>
);

const SCENE_VIEWS = [S1, S2, S3, S4, S5, S6, S7];

/** Phụ đề lớn, rõ cho người lớn tuổi */
function Captions() {
  const f = useCurrentFrame();
  const t = f / FPS;
  const i = CAPTIONS.findLastIndex(([s]) => s <= t);
  if (i < 0 || t > SCENES[SCENES.length - 1] + 1) return null;
  const [start, text] = CAPTIONS[i];
  const k = ease(f, start * FPS, start * FPS + 8);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 300 }}>
      <div
        style={{
          maxWidth: 840,
          padding: "0 40px",
          textAlign: "center",
          fontFamily: serif,
          fontWeight: 500,
          fontSize: 58,
          lineHeight: 1.3,
          color: "#fff",
          textShadow: "0 3px 18px rgba(3,18,74,0.95)",
          opacity: k,
          transform: `translateY(${(1 - k) * 12}px)`,
          textWrap: "balance",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
}

/** Đầu khung: tên buổi lễ + 7 chấm tiến trình */
function Header() {
  const f = useCurrentFrame();
  const t = f / FPS;
  const cur = SCENES.findLastIndex((s) => s <= t);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 240 }}>
      <div style={{ fontFamily: didone, fontSize: 30, letterSpacing: "0.3em", color: "#cfdcf3" }}>STUDENT HONORING CEREMONY</div>
      <div style={{ marginTop: 10, fontFamily: script, fontSize: 52, color: "#fff" }}>Dress code</div>
      <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
        {SCENES.slice(0, 7).map((_, i) => (
          <div key={i} style={{ width: i === cur ? 36 : 10, height: 10, borderRadius: 5, background: i <= cur ? "#e8eefa" : "rgba(232,238,250,0.3)" }} />
        ))}
      </div>
    </AbsoluteFill>
  );
}

export function DressCodeFilm() {
  const f = useCurrentFrame();
  const end = DURATION_S * FPS;
  const fadeOut = 1 - ease(f, end - 30, end);
  return (
    <AbsoluteFill style={{ background: NIGHT, opacity: fadeOut }}>
      <Sky />
      <Audio src={staticFile("voice/dresscode.mp3")} />
      {/* nhạc nền nhỏ dưới giọng đọc, mờ dần cuối phim */}
      <Audio
        src={staticFile("music/elgar-nimrod.mp3")}
        volume={(fr) => 0.1 * interpolate(fr, [0, 45, end - 90, end], [0, 1, 1, 0], { extrapolateRight: "clamp" })}
      />
      {SCENE_VIEWS.map((View, i) => {
        const len = SCENES[i + 1] - SCENES[i] + (i === 6 ? DURATION_S - SCENES[7] : 0);
        return (
          <Sequence key={i} from={Math.round(SCENES[i] * FPS)} durationInFrames={Math.round((len + 0.5) * FPS)}>
            <Scene len={len}>
              <View />
            </Scene>
          </Sequence>
        );
      })}
      <Header />
      <Captions />
    </AbsoluteFill>
  );
}
