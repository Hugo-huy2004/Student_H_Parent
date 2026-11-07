"use client";

import {
  AnimatePresence,
  motion,
  useAnimate,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import GreenwichLogo, { COMPASS_TO_CENTER } from "./GreenwichLogo";

type Props = {
  /** Lớp ảnh nền (server-rendered) */
  children: React.ReactNode;
};

const EASE = [0.16, 1, 0.3, 1] as const;
const SLIDE_EASE = [0.65, 0, 0.35, 1] as const;
/** Thu nhỏ đều tay, chỉ chậm lại ở cuối — để thấy rõ la bàn co dần suốt 4s */
const SHRINK_EASE = [0.4, 0.1, 0.25, 1] as const;
const HOLD_MS = 900; // giữ logo hoàn chỉnh trước khi kéo màn
const SEEN_KEY = "gre-intro-seen";

/* Trạng thái ban đầu của từng phần logo (đặt ngay khi render, kể cả SSR → không nháy) */
const introStart: Record<"compass" | "line1" | "line2", Variants> = {
  compass: { hidden: { opacity: 0, x: COMPASS_TO_CENTER, scale: 3.2, rotate: -270 } },
  line1: { hidden: { opacity: 0, x: -28 } },
  line2: { hidden: { opacity: 0, x: -28 } },
};

/*
 * Intro:
 *  0.0s  la bàn hiện to giữa màn hình, vừa xoay vừa thu nhỏ dần (2.4s)
 *  2.4s  la bàn trượt ngang sang trái về vị trí trong logo (1s)
 *  3.2s  "UNIVERSITY OF" rồi "GREENWICH" hiện ra
 *  3.9s  kẻ chỉ + dòng chú thích → giữ 0.9s → màn navy kéo lên (~6s tổng)
 */
function Intro({ onDone }: { onDone: () => void }) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    let hold: ReturnType<typeof setTimeout>;
    const controls = animate([
      [".logo-compass", { opacity: [0, 1] }, { duration: 0.8, ease: "easeOut" }],
      [".logo-compass", { scale: [3.2, 1], rotate: [-270, 0] }, { duration: 2.4, ease: SHRINK_EASE, at: 0 }],
      [".logo-compass", { x: [COMPASS_TO_CENTER, "0%"] }, { duration: 1, ease: SLIDE_EASE, at: 2.4 }],
      [".logo-line1", { opacity: [0, 1], x: [-28, 0] }, { duration: 0.9, ease: EASE, at: 3.2 }],
      [".logo-line2", { opacity: [0, 1], x: [-28, 0] }, { duration: 0.9, ease: EASE, at: 3.4 }],
      [".intro-rule", { scaleX: [0, 1] }, { duration: 0.9, ease: EASE, at: 3.9 }],
      [".intro-caption", { opacity: [0, 1], y: [8, 0] }, { duration: 0.8, ease: EASE, at: 4.1 }],
    ]);
    controls.then(() => (hold = setTimeout(onDone, HOLD_MS)));

    const skip = (e: KeyboardEvent) => (e.key === "Escape" || e.key === "Enter" || e.key === " ") && onDone();
    window.addEventListener("keydown", skip);
    document.body.style.overflow = "hidden";
    return () => {
      controls.stop();
      clearTimeout(hold);
      window.removeEventListener("keydown", skip);
      document.body.style.overflow = "";
    };
  }, [animate, onDone]);

  return (
    <motion.div
      ref={scope}
      className="intro"
      onClick={onDone}
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 1.6, ease: [0.76, 0, 0.24, 1] } }}
    >
      <motion.div
        className="intro-mark"
        initial="hidden"
        exit={{ opacity: 0, y: -24, filter: "blur(6px)", transition: { duration: 0.9, ease: "easeIn" } }}
      >
        <GreenwichLogo className="intro-logo" {...introStart} />
        <motion.span className="intro-rule" initial={{ scaleX: 0 }} />
        <motion.p className="intro-caption" initial={{ opacity: 0 }}>
          Lễ Tôn vinh · Summer 2026
        </motion.p>
      </motion.div>
      <motion.button
        type="button"
        className="intro-skip"
        onClick={onDone}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.2 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        Bỏ qua · Skip
      </motion.button>
    </motion.div>
  );
}

/* ── Hero: chạy sau khi intro kéo lên ── */
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.35 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE } },
};
const unveil: Variants = {
  hidden: { y: "105%" },
  show: { y: "0%", transition: { duration: 1.4, ease: EASE } },
};

export default function Hero({ children }: Props) {
  const reduce = useReducedMotion();
  // Cuộn rời bìa: tiêu đề lùi xa (thu nhỏ, mờ, nhoè), ảnh nền trôi chậm hơn → chiều sâu
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bodyScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const bodyOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const bodyBlur = useTransform(scrollYProgress, [0, 0.75], [0, 10], { clamp: true });
  const bodyFilter = useTransform(bodyBlur, (v) => `blur(${v}px)`);
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const [phase, setPhase] = useState<"intro" | "done">("intro");
  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    setPhase("done");
  }, []);

  // Đã xem intro trong phiên này, hoặc người xem tắt chuyển động → bỏ qua intro
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    if (seen || reduce) requestAnimationFrame(finish);
  }, [reduce, finish]);

  const show = phase === "done" ? "show" : "hidden";

  return (
    <section ref={sectionRef} className="hero" aria-labelledby="hero-title">
      <AnimatePresence>{phase === "intro" && <Intro key="intro" onDone={finish} />}</AnimatePresence>

      <motion.div
        className="hero-media"
        style={reduce ? undefined : { y: mediaY }}
        initial={{ opacity: 0, scale: 1.08 }}
        animate={phase === "done" ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 2.4, ease: EASE }}
      >
        {children}
      </motion.div>

      <motion.header className="masthead" initial="hidden" animate={show} variants={stagger}>
        <motion.span variants={rise}>
          <GreenwichLogo className="logo" />
        </motion.span>
        <motion.span
          className="masthead-rule"
          aria-hidden
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.6, ease: EASE } } }}
        />
        <motion.span className="masthead-note" variants={rise}>
          Thư mời · Invitation
        </motion.span>
      </motion.header>

      {/* Bìa: tiêu đề thư mời */}
      <motion.div
        className="hero-body"
        initial="hidden"
        animate={show}
        variants={stagger}
        style={reduce ? undefined : { scale: bodyScale, opacity: bodyOpacity, filter: bodyFilter }}
      >
        <motion.p className="kicker" variants={rise}>
          Thư mời tham dự
          <span className="en" lang="en">Invitation to attend</span>
        </motion.p>
        {/* Key visual: STUDENT HONORING CEREMONY, chữ vàng ánh kim */}
        <motion.h1 id="hero-title" className="kv-title" variants={stagger}>
          <svg className="kv-flourish" viewBox="0 0 260 120" aria-hidden>
            <defs>
              <linearGradient id="kv-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fff4cf" />
                <stop offset="40%" stopColor="#e9c46f" />
                <stop offset="70%" stopColor="#a8792a" />
                <stop offset="100%" stopColor="#f3d68c" />
              </linearGradient>
            </defs>
            <motion.path
              d="M30 40 C 70 -10, 140 10, 120 50 C 100 90, 20 80, 40 50 C 60 20, 170 0, 250 60"
              fill="none"
              stroke="url(#kv-gold)"
              strokeWidth="2.4"
              strokeLinecap="round"
              variants={{
                hidden: { pathLength: 0 },
                show: { pathLength: 1, transition: { duration: 2.2, ease: EASE, delay: 0.6 } },
              }}
            />
          </svg>
          <span className="kv-sparkle" aria-hidden />
          <span className="mask">
            <motion.span className="gold kv-big" variants={unveil}>Student</motion.span>
          </span>
          <span className="mask">
            <motion.span className="gold" variants={unveil}>Honoring</motion.span>
          </span>
          <span className="mask kv-last">
            <motion.span className="gold kv-big" variants={unveil}>Ceremony</motion.span>
            <motion.span className="kv-term" variants={rise}>
              Summer
              <br />
              2026
              <br />
              Trimester
            </motion.span>
          </span>
        </motion.h1>
        <motion.p className="kv-vi" variants={rise}>
          Lễ Tôn vinh Sinh viên Xuất sắc · Kỳ Summer 2026
        </motion.p>
      </motion.div>

      <motion.a
        href="#about"
        className="scroll-cue"
        initial={{ opacity: 0 }}
        animate={phase === "done" ? { opacity: 1, transition: { delay: 1.8, duration: 1 } } : undefined}
      >
        <span>Mở thư · Open</span>
        <span className="scroll-cue-line" aria-hidden />
      </motion.a>
    </section>
  );
}
