"use client";

import { useEffect, useRef } from "react";
import { FILM_DONE } from "@/lib/film";

/**
 * Ngôi sao pha lê "người dẫn đường": ảnh chiếc cúp bay theo từng phần của thư mời,
 * đậu vào các "chỗ đậu" `[data-star]` (kích thước chỗ đậu = kích thước sao, `data-glow` = độ sáng).
 * Cuộn qua ranh giới giữa 2 chỗ đậu → sao bay sang, xoay theo đà cuộn; đứng yên → lơ lửng, lấp lánh.
 * Chỉ hiện sau khi phim intro chiếu xong.
 */

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const smooth = (a: number, b: number, t: number) => {
  const k = Math.min(Math.max((t - a) / (b - a), 0), 1);
  return k * k * (3 - 2 * k);
};

/** Chỗ đậu hiện tại: nội suy giữa 2 chỗ đậu kẹp tâm màn hình */
function slotTarget() {
  const list = Array.from(document.querySelectorAll<HTMLElement>("[data-star]"))
    .map((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2, s: Math.min(r.width, r.height), g: +(el.dataset.glow || 0) };
    })
    .filter((s) => s.s > 0);
  if (!list.length) return null;
  const c = innerHeight / 2;
  const i = list.findIndex((s) => s.y > c);
  if (i === 0) return list[0];
  if (i === -1) return list[list.length - 1];
  const a = list[i - 1];
  const b = list[i];
  const k = smooth(0.3, 0.7, (c - a.y) / (b.y - a.y));
  return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), s: lerp(a.s, b.s, k), g: lerp(a.g, b.g, k) };
}

export default function Guide() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cur = { x: 0, y: 0, s: 0, g: 0 };
    let spin = 0;
    let lastScroll = scrollY;
    let prev = performance.now();
    let raf = 0;
    let snap = true; // lần đầu: đặt thẳng vào chỗ đậu

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      const slot = slotTarget();
      if (!slot) return;
      const k = snap || reduce ? 1 : 1 - Math.exp(-dt * 5);
      snap = false;
      const vx = (slot.x - cur.x) * k;
      cur.x += vx;
      cur.y += (slot.y - cur.y) * k;
      cur.s += (slot.s - cur.s) * k;
      cur.g += (slot.g - cur.g) * k;
      // xoay theo đà cuộn rồi chậm dần; nghiêng theo hướng bay
      spin = spin * Math.exp(-dt * 2) + (scrollY - lastScroll) * 0.15;
      lastScroll = scrollY;
      const t = now / 1000;
      const bob = reduce ? 0 : Math.sin(t * 1.3) * 6;
      const sway = reduce ? 0 : Math.sin(t * 0.7) * 6;
      el.style.transform = `translate(${cur.x}px, ${cur.y + bob}px) translate(-50%, -50%) rotate(${sway + spin + vx * 0.4}deg)`;
      el.style.width = el.style.height = `${cur.s}px`;
      el.style.setProperty("--glow", String(0.5 + cur.g * 0.35 + (reduce ? 0 : 0.12 * Math.sin(t * 2.2))));
    };

    const start = () => {
      cancelAnimationFrame(raf);
      snap = true;
      el.dataset.on = "";
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener(FILM_DONE, start);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener(FILM_DONE, start);
    };
  }, []);

  return (
    <div ref={ref} className="guide" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element -- ảnh nhỏ, đổi kích thước mượt từng khung */}
      <img src="/star-crystal.jpg" alt="" />
    </div>
  );
}
