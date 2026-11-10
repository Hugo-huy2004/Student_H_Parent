"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import GreenwichLogo from "./GreenwichLogo";
import { FILM_DONE, FILM_PLAY, lockForFilm } from "@/lib/film";

type Props = {
  /** Lớp ảnh nền (server-rendered) */
  children: React.ReactNode;
};

const EASE = [0.16, 1, 0.3, 1] as const;
const INTRO_SRC = "/film/intro.mp4";

/**
 * Màn mở đầu kiểu thiệp Anh → chạm "Mở thư mời" → phim intro (public/film/intro.mp4, dựng bằng Remotion
 * trong film/) phát toàn màn hình, có tiếng, phải xem hết: không có nút bỏ qua / dừng / tua.
 * Video được phát ngay trong cú chạm nên trình duyệt cho phép phát có tiếng.
 */
function Intro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"gate" | "film">("gate");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Đang chiếu: khoá cuộn / phóng to / dừng / tua
  useEffect(() => (phase === "film" ? lockForFilm(videoRef.current) : undefined), [phase]);

  const open = () => {
    const v = videoRef.current;
    if (!v) return;
    window.dispatchEvent(new Event(FILM_PLAY)); // mồi nhạc nền + phim Dress code trong cùng cú chạm
    v.play().then(
      () => setPhase("film"),
      () => onDone() // trình duyệt không phát được video (rất hiếm) → vẫn mở thư mời
    );
  };

  const ended = () => {
    window.dispatchEvent(new Event(FILM_DONE));
    onDone();
  };

  return (
    <motion.div className="intro" exit={{ opacity: 0, transition: { duration: 0.8 } }}>
      <video
        ref={videoRef}
        className={`intro-film${phase === "film" ? " is-on" : ""}`}
        src={INTRO_SRC}
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback"
        onEnded={ended}
        aria-label="Phim mở đầu thư mời · Invitation film"
      />
      <AnimatePresence>
        {phase === "gate" && (
          <motion.div
            key="gate"
            className="intro-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 1.2, ease: EASE } }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.5 } }}
          >
            <GreenwichLogo className="intro-logo" />
            <span className="intro-rule" aria-hidden />
            <p className="intro-to">Kính gửi Quý Phụ huynh</p>
            <p className="intro-lead" lang="en">
              The University of Greenwich (Vietnam)
              <br />
              requests the pleasure of your company at the
            </p>
            <p className="intro-event" lang="en">Student Honoring Ceremony</p>
            <p className="intro-term" lang="en">Summer 2026</p>
            <span className="intro-rule" aria-hidden />
            <button type="button" className="btn intro-open" onClick={open}>
              Mở thư mời · Open invitation
            </button>
            <p className="intro-hint">Vui lòng bật âm thanh · Please turn on sound</p>
          </motion.div>
        )}
      </AnimatePresence>
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
  const finish = useCallback(() => setPhase("done"), []);

  // Người xem bật "giảm chuyển động" → không chiếu phim, vào thẳng thư mời
  useEffect(() => {
    if (!reduce) return;
    window.dispatchEvent(new Event(FILM_DONE));
    requestAnimationFrame(finish);
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
        {/* Key visual: STUDENT HONORING (serif bạc) + Ceremony (chữ viết tay) */}
        <motion.h1 id="hero-title" className="kv-title" variants={stagger}>
          <span className="mask kv-first">
            <motion.span className="gold" variants={unveil}>
              Student
              <span className="kv-sparkle" aria-hidden />
            </motion.span>
            <motion.span className="kv-term" variants={rise}>
              Trimester
              <br />
              Summer
              <br />
              2026
            </motion.span>
          </span>
          <span className="mask">
            <motion.span className="gold kv-honoring" variants={unveil}>Honoring</motion.span>
          </span>
          <motion.span className="gold kv-script" variants={rise}>Ceremony</motion.span>
        </motion.h1>
        {/* chỗ đậu của ngôi sao pha lê, dưới tiêu đề như trên poster */}
        <span className="star-slot star-slot-hero" data-star data-glow="0.9" aria-hidden />
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
