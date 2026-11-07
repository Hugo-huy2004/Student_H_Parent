"use client";

import { useEffect, useRef } from "react";

type Props = {
  items: string[];
  /** Có → quay vài vòng khi cuộn tới rồi dừng ở giá trị này. Không có → quay liên tục như lồng xổ số. */
  value?: string;
  /** Giây cho một vòng khi quay liên tục */
  loopSeconds?: number;
  /** Lệch pha (giây) để các reel không chạy trùng nhịp */
  offset?: number;
};

const LAND_STEPS = 36;
const LAND_MS = 3200;

export default function Reel({ items, value, loopSeconds = 5, offset = 0 }: Props) {
  const reelRef = useRef<HTMLSpanElement>(null);
  const stripRef = useRef<HTMLSpanElement>(null);
  const n = items.length;
  const idx = value === undefined ? -1 : items.indexOf(value);
  const landed = idx >= 0;
  // quay rồi dừng: LAND_STEPS ô trước giá trị + giá trị; quay liên tục: danh sách lặp 2 lần
  const cells = landed
    ? Array.from({ length: LAND_STEPS + 2 }, (_, k) => items[(((idx - LAND_STEPS + k) % n) + n) % n])
    : [...items, ...items];

  useEffect(() => {
    const reel = reelRef.current;
    const strip = stripRef.current;
    if (!landed || !reel || !strip || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        strip.style.transition = "none";
        strip.style.transform = "translateY(0)";
        void strip.offsetHeight; // ép reflow trước khi quay
        strip.dataset.spinning = "true";
        strip.style.transition = `transform ${LAND_MS}ms cubic-bezier(.1,.6,.12,1) ${offset * 1000}ms, filter .9s, opacity .9s`;
        strip.style.transform = `translateY(${-LAND_STEPS}em)`;
        timer = setTimeout(() => (strip.dataset.spinning = "false"), LAND_MS * 0.8 + offset * 1000);
      },
      { threshold: 0.6 }
    );
    io.observe(reel);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [landed, offset]);

  return (
    <span ref={reelRef} className="reel" aria-hidden>
      <span className="reel-still">{landed ? value : "··"}</span>
      <span
        ref={stripRef}
        className="reel-strip"
        data-mode={landed ? "land" : "loop"}
        data-spinning={landed ? "false" : "true"}
        style={
          landed
            ? { transform: `translateY(${-LAND_STEPS}em)` }
            : ({ "--n": n, animationDuration: `${loopSeconds}s`, animationDelay: `${-offset}s` } as React.CSSProperties)
        }
      >
        {cells.map((it, i) => (
          <span key={i}>{it}</span>
        ))}
      </span>
    </span>
  );
}
