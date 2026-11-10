"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#ffffff", "#dce6f7", "#dce6f7", "#ffffff", "#b8c9ea"];

type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number };

/**
 * Pháo hoa vàng + ánh lấp lánh trên canvas, phủ kín phần tử cha (cha cần position: relative).
 * Chỉ chạy khi đang hiện trên màn hình; tắt hẳn khi người xem bật "giảm chuyển động".
 */
export default function Fireworks({ every = 1100 }: { every?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    let last = 0;
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

    const sparks: Spark[] = [];
    const twinkles = Array.from({ length: 36 }, () => ({
      x: Math.random(),
      y: Math.random(),
      phase: Math.random() * Math.PI * 2,
      size: 0.8 + Math.random() * 1.8,
    }));

    const burst = () => {
      const x = w * (0.12 + Math.random() * 0.76);
      const y = h * (0.08 + Math.random() * 0.4);
      const n = 54;
      const speed = 2.2 + Math.random() * 2.4;
      const color = COLORS[(Math.random() * COLORS.length) | 0];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const s = speed * (0.55 + Math.random() * 0.5);
        sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0, max: 55 + Math.random() * 35, color, size: 1 + Math.random() * 1.6 });
      }
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);

      // ánh lấp lánh: chấm sáng + tia chữ thập nhấp nháy
      for (const s of twinkles) {
        const a = (Math.sin(t / 650 + s.phase) + 1) / 2;
        const x = s.x * w;
        const y = s.y * h;
        ctx.globalAlpha = a * 0.85;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x - s.size * 3, y - 0.5, s.size * 6, 1);
        ctx.fillRect(x - 0.5, y - s.size * 3, 1, s.size * 6);
        ctx.beginPath();
        ctx.arc(x, y, s.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      if (t - last > every) {
        burst();
        last = t;
      }

      // pháo hoa: mỗi tia là một vệt ngắn, rơi nhẹ, mờ dần
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.life++;
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.035;
        p.x += p.vx;
        p.y += p.vy;
        const k = 1 - p.life / p.max;
        if (k <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = k;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size * k + 0.4;
        ctx.beginPath();
        ctx.moveTo(p.x - p.vx * 3, p.y - p.vy * 3);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!visible) ctx.clearRect(0, 0, w, h);
    });
    io.observe(c);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [every]);

  return <canvas ref={ref} className="fireworks" aria-hidden />;
}
