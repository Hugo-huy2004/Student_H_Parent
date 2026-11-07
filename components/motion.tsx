"use client";

import {
  animate,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

const tags = {
  div: motion.div,
  li: motion.li,
  p: motion.p,
  h2: motion.h2,
  address: motion.address,
  a: motion.a,
};

type RevealProps = HTMLMotionProps<"div"> & {
  as?: keyof typeof tags;
  delay?: number;
  href?: string;
  target?: string;
  rel?: string;
};

/** Hiện dần + trượt nhẹ lên khi cuộn tới (chạy một lần). */
export function Reveal({ as = "div", delay = 0, children, ...rest }: RevealProps) {
  const Tag = tags[as] as typeof motion.div;
  return (
    <Tag
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.2, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

const wordsParent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.14 } } };
const word: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.3, ease: EASE } },
};

/** Tiêu đề hiện từng chữ, mờ → rõ. */
export function Words({ text, id, className }: { text: string; id?: string; className?: string }) {
  return (
    <motion.h2
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      variants={wordsParent}
    >
      {text.split(" ").map((w, i) => (
        <motion.span key={i} variants={word}>
          {w}
        </motion.span>
      ))}
    </motion.h2>
  );
}

/** Lớp ảnh nền: hiện mờ dần khi vào màn hình và trôi nhẹ theo cuộn (parallax). */
export function BackdropMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <motion.div
      ref={ref}
      className="backdrop"
      aria-hidden
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 2.4, ease: "easeOut" }}
    >
      <motion.div className="backdrop-img" style={{ y }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * Chân dung tách nền: trồi lên + rõ dần khi cuộn tới, rồi trôi nhẹ theo cuộn.
 */
export function ArchPortrait({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

  return (
    <div ref={ref} className="arch">
      {/* ảnh tự theo dõi việc cuộn tới (không phụ thuộc khung cha) */}
      <motion.div
        className="arch-photo"
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}
      >
        {/* lớp trong chỉ lo parallax, tách khỏi hiệu ứng xuất hiện ở lớp ngoài */}
        <motion.div className="arch-parallax" style={{ y }}>
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Vạch mảnh trên đỉnh màn hình, chạy theo tiến độ đọc thư. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="progress" style={{ scaleX: scrollYProgress }} aria-hidden />;
}

/**
 * Dải ngang tự trượt theo cuộn dọc: khi dải đi qua màn hình, nó chạy từ phần tử đầu tới phần tử cuối.
 * Tắt chuyển động → thành dải vuốt ngang bình thường.
 */
export function ScrollTrack({ children, className }: { children: React.ReactNode; className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [dist, setDist] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0.2, 0.8], [0, -dist], { clamp: true });

  useEffect(() => {
    const w = wrap.current;
    const t = track.current;
    if (!w || !t) return;
    const measure = () => setDist(Math.max(0, t.scrollWidth - w.clientWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(w);
    ro.observe(t);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrap} className={`track-wrap ${reduce ? "track-manual" : ""}`}>
      <motion.ul ref={track} className={`track ${className ?? ""}`} style={reduce ? undefined : { x }}>
        {children}
      </motion.ul>
    </div>
  );
}

type Range = [number, number];
type Edge = "start" | "center" | "end";
type Offset = [`${Edge} ${Edge}`, `${Edge} ${Edge}`];

/**
 * Scrollytelling: biến đổi chạy theo đúng vị trí cuộn (cuộn ngược thì chạy ngược).
 * Mặc định tính từ lúc phần tử chạm đáy màn hình tới lúc nó ra giữa màn hình.
 */
export function Scrub({
  children,
  className,
  scale = [1, 1],
  y = [0, 0],
  rotate = [0, 0],
  opacity = [1, 1],
  offset = ["start end", "center center"],
}: {
  children: React.ReactNode;
  className?: string;
  scale?: Range;
  y?: Range;
  rotate?: Range;
  opacity?: Range;
  offset?: Offset;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const s = useTransform(scrollYProgress, [0, 1], scale);
  const ty = useTransform(scrollYProgress, [0, 1], y);
  const r = useTransform(scrollYProgress, [0, 1], rotate);
  const o = useTransform(scrollYProgress, [0, 1], opacity);
  return (
    <motion.div ref={ref} className={className} style={reduce ? undefined : { scale: s, y: ty, rotate: r, opacity: o }}>
      {children}
    </motion.div>
  );
}

/** Số đếm lên khi cuộn tới (một lần). */
export function CountUp({ from, to, duration = 1.8 }: { from: number; to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to); // SSR/không JS: hiện số cuối
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setValue(from);
    let controls: ReturnType<typeof animate> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        controls = animate(from, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setValue(Math.round(v)) });
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      controls?.stop();
    };
  }, [from, to, duration]);
  return <span ref={ref}>{value}</span>;
}
