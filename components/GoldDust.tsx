"use client";

import { useEffect, useRef } from "react";

/**
 * Bụi vàng bay lên, phủ kín phần tử cha (cha cần position: relative) — dùng quanh chiếc cúp.
 * Chỉ chạy khi đang hiện trên màn hình; tắt khi "giảm chuyển động".
 */
export default function GoldDust({ count = 34 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const resize = () => {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    const motes = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.8,
      speed: 0.00008 + Math.random() * 0.00016, // phần chiều cao khung / ms
      sway: Math.random() * Math.PI * 2,
      depth: 0.35 + Math.random() * 0.65, // xa → mờ, chậm
    }));

    let prev = performance.now();
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(t - prev, 50);
      prev = t;
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.y -= m.speed * dt * m.depth;
        if (m.y < -0.05) {
          m.y = 1.05;
          m.x = 0.2 + Math.random() * 0.6; // bay lên từ quanh chân cúp
        }
        const x = (m.x + Math.sin(t / 2400 + m.sway) * 0.02) * w;
        const y = m.y * h;
        const glow = 0.35 + 0.65 * ((Math.sin(t / 900 + m.sway) + 1) / 2);
        const g = ctx.createRadialGradient(x, y, 0, x, y, m.r * 4);
        g.addColorStop(0, `rgba(225, 238, 255, ${0.75 * glow * m.depth})`);
        g.addColorStop(1, "rgba(170, 205, 255, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, m.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // chỉ vẽ khi khung đang hiện trên màn hình
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) {
        prev = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(c);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [count]);

  return <canvas ref={ref} className="gold-dust" aria-hidden />;
}
