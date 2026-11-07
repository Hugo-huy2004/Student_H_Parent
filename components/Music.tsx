"use client";

import { useEffect, useRef } from "react";

// Elgar — Enigma Variations, IX. "Nimrod" · John Barbirolli & Hallé Orchestra
// Public domain — archive.org/details/EdwardElgar-EnigmaVariations (cũng có trên Wikimedia Commons)
const SRC = "/music/elgar-nimrod.mp3";
const VOLUME = 0.5;

/**
 * Nhạc nền tự phát, không có nút.
 * Trình duyệt chặn phát có tiếng trước khi người xem tương tác → thử phát ngay khi mở,
 * bị chặn thì phát ở lần chạm / phím đầu tiên (chạm để cuộn cũng tính).
 * Ẩn tab / chuyển app → tạm dừng; quay lại → phát tiếp.
 */
export default function Music() {
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    let fade: ReturnType<typeof setInterval> | undefined;

    // tăng âm lượng dần cho êm (iOS bỏ qua volume — vẫn phát bình thường)
    const play = () => {
      a.volume = 0;
      return a.play().then(() => {
        clearInterval(fade);
        fade = setInterval(() => {
          a.volume = Math.min(VOLUME, a.volume + 0.025);
          if (a.volume >= VOLUME) clearInterval(fade);
        }, 120);
      });
    };

    const events = ["pointerdown", "touchstart", "keydown"] as const;
    const stopListening = () => events.forEach((e) => window.removeEventListener(e, onGesture));
    const onGesture = () => {
      play().then(stopListening, () => {});
    };

    play().catch(() => events.forEach((e) => window.addEventListener(e, onGesture, { passive: true })));

    const onVisibility = () => {
      if (document.hidden) a.pause();
      else if (a.currentTime > 0) play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(fade);
      stopListening();
      document.removeEventListener("visibilitychange", onVisibility);
      a.pause();
    };
  }, []);

  // preload="none": chỉ tải nhạc khi bắt đầu phát → mở trang nhẹ hơn trên 4G
  return <audio ref={ref} src={SRC} loop preload="none" />;
}
