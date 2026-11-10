"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { FILM_PLAY, lockForFilm } from "@/lib/film";

/**
 * Phim hướng dẫn trang phục (dựng bằng Remotion trong film/, xuất ra public/film/dresscode.mp4).
 * Cuộn tới → tự phóng toàn màn hình và phát có tiếng; không có nút tắt / dừng / tua,
 * khoá cuộn tới khi phim hết rồi thu nhỏ về khung. Mỗi lần tải trang tự phát một lần; sau đó có nút "Xem lại".
 */
const SRC = "/film/dresscode.mp4";
const POSTER = "/film/dresscode-poster.jpg";

type Phase = "idle" | "full" | "blocked" | "done";

export default function DressFilm() {
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  // "Mồi" video ngay trong cú chạm "Mở thư mời" → iPhone cho phát có tiếng về sau mà không cần chạm lại
  useEffect(() => {
    const prime = () => {
      const v = videoRef.current;
      if (!v) return;
      v.muted = true;
      v.play()
        .then(() => {
          v.pause();
          v.currentTime = 0;
          v.muted = false;
        })
        .catch(() => (v.muted = false));
    };
    window.addEventListener(FILM_PLAY, prime);
    return () => window.removeEventListener(FILM_PLAY, prime);
  }, []);

  // Cuộn tới khung phim (lần đầu sau khi tải trang) → phóng toàn màn hình
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setPhase("full");
      },
      { threshold: 0.55 }
    );
    io.observe(box);
    return () => io.disconnect();
  }, []);

  const start = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    v.play().then(
      () => {
        setPhase("full");
        window.dispatchEvent(new Event("voice:start")); // hạ nhỏ nhạc nền
      },
      () => setPhase("blocked") // trình duyệt chặn tiếng → cần một cú chạm
    );
  };

  // Đang toàn màn hình: phát, khoá cuộn, không cho dừng
  useEffect(() => {
    if (phase !== "full" && phase !== "blocked") return;
    const v = videoRef.current;
    if (phase === "full" && v?.paused) start();
    return lockForFilm(v);
  }, [phase]);

  const onEnded = () => {
    window.dispatchEvent(new Event("voice:end"));
    setPhase("done");
  };

  const full = phase === "full" || phase === "blocked";

  return (
    <div ref={boxRef} className="dress-film-slot">
      <motion.div layout transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }} className={`dress-film${full ? " is-full" : ""}`}>
        <video
          ref={videoRef}
          src={SRC}
          poster={POSTER}
          playsInline
          preload="metadata"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload nofullscreen noremoteplayback"
          onEnded={onEnded}
          aria-label="Phim hướng dẫn trang phục · Dress code guide"
        />
        {phase === "blocked" && (
          <button type="button" className="btn dress-film-start" onClick={start}>
            Chạm để xem hướng dẫn trang phục
          </button>
        )}
        {phase === "done" && (
          <button
            type="button"
            className="btn btn-ghost dress-film-again"
            onClick={() => {
              setPhase("full");
            }}
          >
            ▶ Xem lại · Watch again
          </button>
        )}
      </motion.div>
    </div>
  );
}
