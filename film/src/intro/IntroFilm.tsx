import { ThreeCanvas } from "@remotion/three";
import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { didone, script, serif } from "../fonts";
import { Scene3D } from "./Scene3D";
import { at, CAPTIONS, DURATION_S, easeInOut, easeOut, FPS, T, VOICE_AT, VOICE_END } from "./timeline";

/**
 * Phim intro "Tia sáng" (dọc 1080×1920, 40s): 3D (Scene3D) + lớp 2D phủ trên (chòm sao, loé sáng,
 * đường sáng cắt lộ chữ, tấm kính thông tin, logo) + lời đọc, nhạc Nimrod, hiệu ứng âm thanh.
 */

const W = 1080;
const H = 1920;
const CX = W / 2;
const CY = H / 2;
const PX = H / (2 * Math.tan((20 * Math.PI) / 180) * 8); // px trên 1 đơn vị 3D (camera fov 40, cách 8)

const SILVER_GRADIENT = "linear-gradient(180deg, #ffffff 0%, #e6edf9 30%, #8e9cba 52%, #f7f9fd 64%, #7a88a8 88%, #e3e9f4 100%)";
/** Bề mặt bạc; `sweep` (%) = vị trí vệt sáng chạy qua, chỉ hiện bên trong nét chữ */
const silver = (sweep = -50): CSSProperties => ({
  backgroundImage: `linear-gradient(105deg, transparent ${sweep - 8}%, rgba(255,255,255,0.95) ${sweep}%, transparent ${sweep + 8}%), ${SILVER_GRADIENT}`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
});

const useT = () => useCurrentFrame() / FPS;

/** Chữ bạc nổi khối 3D: lớp dưới là các bậc đổ bóng (độ dày), lớp trên là bề mặt kim loại */
function Chrome({ children, style, sweep }: { children: ReactNode; style: CSSProperties; sweep?: number }) {
  const depth = Array.from({ length: 8 }, (_, i) => `0 ${i + 1}px 0 hsl(222 55% ${34 - i * 3}%)`).join(",");
  return (
    <div style={{ position: "relative", ...style }}>
      <div style={{ color: "#14245a", textShadow: `${depth}, 0 18px 30px rgba(0,0,20,0.7)` }}>{children}</div>
      <div style={{ position: "absolute", inset: 0, ...silver(sweep) }}>{children}</div>
    </div>
  );
}

/** 0–2.5s: một chấm sáng loé lên giữa màn đen, có tia chữ thập */
function Ignite() {
  const t = useT();
  const grow = easeOut(at(t, 0.3, 2.3));
  const fade = 1 - at(t, 2.2, 3.2);
  if (fade <= 0) return null;
  const s = 30 + grow * 380;
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <div style={{ position: "absolute", left: CX - s / 2, top: CY - s / 2, width: s, height: s, borderRadius: "50%", background: "radial-gradient(closest-side, #fff, rgba(170,205,255,0.6) 25%, transparent 70%)" }} />
      {[0, 90].map((r) => (
        <div
          key={r}
          style={{
            position: "absolute",
            left: CX - 500 * grow,
            top: CY - 2,
            width: 1000 * grow,
            height: 4,
            background: "linear-gradient(90deg, transparent, #fff 50%, transparent)",
            transform: `rotate(${r + t * 8}deg)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
}

/** Chòm sao: 16 đỉnh hình ngôi sao 8 cánh hiện dần, nối nét sáng; trùng khít chỗ ngôi sao pha lê sẽ khớp */
const R_TIP = 2.05 * 0.5 * PX;
const R_IN = 0.96 * 0.5 * PX;
const VERTS = Array.from({ length: 16 }, (_, i) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 8;
  const r = i % 2 ? R_IN : R_TIP;
  return [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
});
function Constellation() {
  const t = useT();
  const [a, b] = T.constellation;
  const k = at(t, a, b);
  const fade = 1 - at(t, T.shards[1] - 0.8, T.shards[1]);
  if (k <= 0 || fade <= 0) return null;
  const path = VERTS.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ") + "Z";
  const len = 16 * Math.hypot(R_TIP - R_IN * Math.cos(Math.PI / 8), R_IN * Math.sin(Math.PI / 8));
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <svg width={W} height={H} style={{ filter: "drop-shadow(0 0 8px rgba(170,205,255,0.9))" }}>
        <path d={path} fill="none" stroke="rgba(220,235,255,0.85)" strokeWidth={2.5} strokeDasharray={len} strokeDashoffset={len * (1 - k)} />
        {VERTS.map(([x, y], i) => {
          const v = at(t, a + (i / 16) * (b - a), a + (i / 16) * (b - a) + 0.25);
          return <circle key={i} cx={x} cy={y} r={(i % 2 ? 4 : 7) * v} fill="#fff" />;
        })}
      </svg>
    </AbsoluteFill>
  );
}

/** Khoảnh khắc khớp: loé trắng + vòng sóng ánh sáng toả ra */
function Flash() {
  const t = useT();
  const d = t - T.assemble;
  if (d < -0.1 || d > 1.6) return null;
  const flash = Math.exp(-((d / 0.22) ** 2));
  const ring = easeOut(at(d, 0, 1.4));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.95), rgba(170,205,255,0.4) 40%, transparent 70%)", opacity: flash }} />
      <div
        style={{
          position: "absolute",
          left: CX - ring * 900,
          top: CY - ring * 900,
          width: ring * 1800,
          height: ring * 1800,
          borderRadius: "50%",
          border: `${6 * (1 - ring) + 1}px solid rgba(220,235,255,${0.9 * (1 - ring)})`,
          boxShadow: `0 0 40px rgba(170,205,255,${0.7 * (1 - ring)})`,
        }}
      />
    </AbsoluteFill>
  );
}

/** Đường sáng sắc như lưỡi dao quét ngang, để lộ một dòng chữ phía sau */
function Slice({ start, y, children }: { start: number; y: number; children: ReactNode }) {
  const t = useT();
  const k = easeInOut(at(t, start, start + 0.55));
  const bladeX = -200 + k * (W + 400);
  const bladeOn = k > 0 && k < 1;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", clipPath: `inset(-40% ${(1 - k) * 100}% -40% 0)` }}>{children}</div>
      {bladeOn && (
        <div
          style={{
            position: "absolute",
            left: bladeX - 6,
            top: y - 60,
            width: 12,
            height: 320,
            transform: "rotate(14deg)",
            background: "linear-gradient(transparent, #fff 30%, #fff 70%, transparent)",
            boxShadow: "0 0 30px 10px rgba(170,205,255,0.9), 0 0 80px 30px rgba(90,140,255,0.5)",
          }}
        />
      )}
    </>
  );
}

const SLICES = [T.title[0] + 0.3, T.title[0] + 0.8, T.title[0] + 1.35];

function Title() {
  const t = useT();
  if (t < T.title[0] || t > T.outro[0] + 1.2) return null;
  const toInfo = easeInOut(at(t, T.info[0] - 0.4, T.info[0] + 0.6));
  const out = 1 - at(t, T.outro[0], T.outro[0] + 1);
  const sweep = at(t, T.title[0] + 2.4, T.title[0] + 3.6) * 160 - 30; // vệt sáng chạy qua chữ (trong nét chữ)
  return (
    <AbsoluteFill style={{ opacity: out, transform: `translateY(${-90 * toInfo}px) scale(${1 - 0.12 * toInfo})` }}>
      <Slice start={SLICES[0]} y={560}>
        <Chrome sweep={sweep} style={{ fontFamily: didone, fontSize: 148, lineHeight: 1, letterSpacing: "0.01em" }}>STUDENT</Chrome>
      </Slice>
      <Slice start={SLICES[1]} y={740}>
        <Chrome sweep={sweep - 12} style={{ fontFamily: didone, fontSize: 132, lineHeight: 1, letterSpacing: "0.01em" }}>HONORING</Chrome>
      </Slice>
      <Slice start={SLICES[2]} y={860}>
        <Chrome sweep={sweep - 24} style={{ fontFamily: script, fontSize: 170, lineHeight: 1.3, paddingRight: 30 }}>Ceremony</Chrome>
      </Slice>
      <div
        style={{
          position: "absolute",
          top: 1110,
          width: "100%",
          textAlign: "center",
          fontFamily: didone,
          fontSize: 32,
          letterSpacing: "0.34em",
          color: "#cfdcf3",
          opacity: at(t, SLICES[2] + 0.5, SLICES[2] + 1.2),
        }}
      >
        TRIMESTER · SUMMER 2026
      </div>

    </AbsoluteFill>
  );
}

/** Tấm kính 3D trượt vào, xoay về chính diện */
function Glass({ at: start, from, top, children }: { at: number; from: 1 | -1; top: number; children: ReactNode }) {
  const t = useT();
  const k = easeOut(at(t, start, start + 0.9));
  const out = 1 - at(t, T.outro[0], T.outro[0] + 1);
  return (
    <div style={{ position: "absolute", left: 140, right: 140, top, perspective: 1400, opacity: k * out }}>
      <div
        style={{
          padding: "26px 36px",
          borderRadius: 22,
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))",
          boxShadow: "inset 0 0 0 2px rgba(205,228,255,0.45), inset 0 2px 0 rgba(255,255,255,0.5), 0 30px 60px -20px rgba(0,0,20,0.8)",
          backdropFilter: "blur(14px)",
          transform: `translateX(${from * (1 - k) * 420}px) rotateY(${from * (1 - k) * -70}deg)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Info() {
  const t = useT();
  if (t < T.info[0] - 0.2 || t > T.outro[0] + 1.2) return null;
  return (
    <AbsoluteFill>
      <Glass at={T.info[0]} from={-1} top={1120}>
        <Chrome style={{ fontFamily: didone, fontSize: 56, letterSpacing: "0.05em" }}>18:00 · 17.11.2026</Chrome>
      </Glass>
      <Glass at={T.info[0] + 2.5} from={1} top={1290}>
        <div style={{ fontFamily: didone, fontSize: 30, letterSpacing: "0.03em", color: "#fff", whiteSpace: "nowrap" }}>HALL OF GREENWICH VIETNAM</div>
        <div style={{ marginTop: 6, fontFamily: serif, fontStyle: "italic", fontSize: 25, color: "#cfdcf3" }}>20 Cộng Hòa, Phường Bảy Hiền, TP. Hồ Chí Minh</div>
      </Glass>
      <Glass at={T.info[0] + 3.6} from={-1} top={1470}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, fontFamily: didone, fontSize: 28, letterSpacing: "0.1em", color: "#fff" }}>
          DRESS CODE
          <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#0b3fb0", boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.6)" }} />
          <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#fff" }} />
          BLUE – WHITE
        </div>
      </Glass>
    </AbsoluteFill>
  );
}

/** Kết: ngôi sao thu thành điểm sáng → logo Greenwich hiện ra */
function Outro() {
  const t = useT();
  const [a] = T.outro;
  if (t < a) return null;
  const spark = Math.sin(Math.PI * at(t, a + 1.0, a + 2.4));
  const logo = easeOut(at(t, a + 1.9, a + 3));
  const starTop = CY - (2.35 - 0.3) * PX;
  const y = starTop + (CY - 140 - starTop) * easeInOut(at(t, a + 0.6, a + 1.9));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: CX - 220, top: y - 220, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(closest-side, #fff, rgba(170,205,255,0.5) 30%, transparent 70%)", opacity: spark }} />
      <div style={{ position: "absolute", left: CX - 300, top: y - 3, width: 600 * spark, marginLeft: 300 * (1 - spark), height: 6, background: "linear-gradient(90deg, transparent, #fff, transparent)", opacity: spark }} />
      <div style={{ position: "absolute", top: CY - 260, width: "100%", textAlign: "center", opacity: logo, transform: `scale(${0.94 + 0.06 * logo})` }}>
        <Img src={staticFile("logo-white.svg")} style={{ width: 560 }} />
        <div style={{ marginTop: 40, fontFamily: didone, fontSize: 30, letterSpacing: "0.34em", color: "#cfdcf3" }}>STUDENT HONORING CEREMONY</div>
        <div style={{ marginTop: 8, fontFamily: script, fontSize: 64, color: "#fff" }}>Summer 2026</div>
      </div>
    </AbsoluteFill>
  );
}

function Captions() {
  const t = useT();
  if (t < VOICE_AT || t > VOICE_END + 0.8) return null;
  const i = CAPTIONS.findLastIndex(([s]) => s <= t);
  if (i < 0) return null;
  const [start, text] = CAPTIONS[i];
  const k = at(t, start, start + 0.25);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 300, background: "linear-gradient(transparent 60%, rgba(1,6,22,0.7) 80%, transparent 92%)" }}>
      <div
        style={{
          maxWidth: 840,
          padding: "0 40px",
          textAlign: "center",
          fontFamily: serif,
          fontWeight: 500,
          fontSize: 54,
          lineHeight: 1.3,
          color: "#fff",
          textShadow: "0 3px 18px rgba(2,8,36,0.95), 0 0 2px rgba(2,8,36,0.9)",
          opacity: k,
          textWrap: "balance",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
}

/** Hiệu ứng âm thanh tại giây `s` */
const Sfx = ({ s, src, volume = 1 }: { s: number; src: string; volume?: number }) => (
  <Sequence from={Math.round(s * FPS)} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

export function IntroFilm() {
  const f = useCurrentFrame();
  // Nimrod vào từ giây 80 của bản nhạc → cao trào (giây 100) rơi đúng "Toả sáng…" (giây ~20 của phim)
  const music = (fr: number) =>
    interpolate(fr / FPS, [0, 3, T.shine - 3, T.shine, T.shine + 3, T.title[0] + 1, DURATION_S - 2.5, DURATION_S], [0, 0.22, 0.25, 0.5, 0.42, 0.22, 0.22, 0], {
      extrapolateRight: "clamp",
    });
  return (
    <AbsoluteFill style={{ background: "#010616", opacity: 1 - at(f / FPS, DURATION_S - 1, DURATION_S) }}>
      <ThreeCanvas width={W} height={H} camera={{ fov: 40, position: [0, 0.3, 8], near: 0.1, far: 300 }} gl={{ antialias: true }}>
        <Scene3D />
      </ThreeCanvas>
      <Ignite />
      <Constellation />
      <Flash />
      <Title />
      <Info />
      <Outro />
      <Captions />

      <Sequence from={Math.round(VOICE_AT * FPS)} layout="none">
        <Audio src={staticFile("voice/intro.mp3")} />
      </Sequence>
      <Audio src={staticFile("music/elgar-nimrod.mp3")} trimBefore={80 * FPS} volume={music} />
      <Sfx s={2.0} src="whoosh" volume={0.8} />
      {[0, 2, 4, 6, 8, 10, 12, 14].map((i) => (
        <Sfx key={i} s={T.constellation[0] + (i / 16) * (T.constellation[1] - T.constellation[0])} src="tink" volume={0.35} />
      ))}
      <Sfx s={T.assemble - 2.4} src="riser" volume={0.45} />
      <Sfx s={T.assemble} src="boom" volume={0.9} />
      <Sfx s={T.assemble} src="chime" volume={0.5} />
      <Sfx s={T.shine} src="chime" volume={0.35} />
      {SLICES.map((s) => (
        <Sfx key={s} s={s} src="slice" volume={0.6} />
      ))}
      <Sfx s={T.outro[0] + 1.9} src="chime" volume={0.4} />
    </AbsoluteFill>
  );
}
