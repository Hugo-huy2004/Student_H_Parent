"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import GoldDust from "./GoldDust";

/**
 * "Chiếc cúp năm nay": ngôi sao dẫn đường (components/Guide.tsx) bay vào chỗ đậu lớn ở giữa,
 * xoay theo cuộn và bừng sáng. Khung dính (sticky) giữ sao ở giữa màn hình suốt quãng cuộn.
 */
export default function StarStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const haloScale = useTransform(p, [0, 0.5, 1], [0.4, 1, 1.3]);
  const haloOpacity = useTransform(p, [0, 0.4, 1], [0.2, 0.7, 1]);

  return (
    <section ref={ref} className="star-story" aria-label="Chiếc cúp năm nay · This year's trophy">
      <div className="star-sticky">
        <motion.div className="star-halo" style={{ scale: haloScale, opacity: haloOpacity }} aria-hidden />
        <GoldDust count={46} />
        <span className="star-slot star-slot-trophy" data-star data-glow="1.4" aria-hidden />
      </div>
    </section>
  );
}
