"use client";

import { useEffect, useRef } from "react";
import { FILM_DONE, FILM_PLAY } from "@/lib/film";

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
      if (!film) play().then(stopListening, () => {});
    };

    play().catch(() => events.forEach((e) => window.addEventListener(e, onGesture, { passive: true })));

    // Phim intro: "mồi" nhạc ở chế độ tắt tiếng ngay trong cú chạm (iPhone mới cho phát về sau),
    // phim xong mới bật tiếng từ đầu bản nhạc → không chen vào âm thanh phim.
    let film = false;
    const onFilmPlay = () => {
      film = true;
      a.muted = true;
      a.play().catch(() => {});
    };
    const onFilmDone = () => {
      if (!film) return;
      film = false;
      a.currentTime = 0;
      a.muted = false;
      play().then(stopListening, () => {});
    };
    window.addEventListener(FILM_PLAY, onFilmPlay);
    window.addEventListener(FILM_DONE, onFilmDone);

    // Phim Dress code (đã có nhạc + lời đọc riêng): nhạc nền tắt dần khi phim chạy, phim xong phát tiếp.
    // Dùng pause thay vì hạ âm lượng vì iPhone bỏ qua chỉnh volume.
    let video = false;
    const onVideoStart = () => {
      video = true;
      clearInterval(fade);
      fade = setInterval(() => {
        a.volume = Math.max(0, a.volume - 0.05);
        if (a.volume <= 0) {
          clearInterval(fade);
          a.pause();
        }
      }, 40);
      if (/iPhone|iPad/.test(navigator.userAgent)) a.pause(); // iOS: volume không đổi được → dừng ngay
    };
    const onVideoEnd = () => {
      video = false;
      if (a.currentTime > 0 && !film) play().catch(() => {});
    };
    window.addEventListener("voice:start", onVideoStart);
    window.addEventListener("voice:end", onVideoEnd);

    const onVisibility = () => {
      if (document.hidden) a.pause();
      else if (a.currentTime > 0 && !video && !film) play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(fade);
      stopListening();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener(FILM_PLAY, onFilmPlay);
      window.removeEventListener(FILM_DONE, onFilmDone);
      window.removeEventListener("voice:start", onVideoStart);
      window.removeEventListener("voice:end", onVideoEnd);
      a.pause();
    };
  }, []);

  // preload="none": chỉ tải nhạc khi bắt đầu phát → mở trang nhẹ hơn trên 4G
  return <audio ref={ref} src={SRC} loop preload="none" />;
}
