/** Sự kiện của phim intro (components/Hero.tsx phát; Music, DressFilm, Guide lắng nghe) */
export const FILM_PLAY = "film:play"; // phát ngay trong cú chạm "Mở thư mời" → mở khoá âm thanh
export const FILM_DONE = "film:done"; // phim intro chiếu xong

/**
 * Khoá màn hình trong lúc chiếu phim bắt buộc xem hết: không cuộn, không phóng to,
 * không dừng / tua (kể cả nút tai nghe, màn hình khoá, phím media); bị dừng thì tự phát tiếp.
 * Trả về hàm mở khoá.
 */
export function lockForFilm(v: HTMLVideoElement | null) {
  const block = (e: Event) => e.preventDefault();
  const blockKeys = (e: KeyboardEvent) => {
    const scroll = [" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", "MediaPlayPause", "MediaStop"];
    const zoom = (e.ctrlKey || e.metaKey) && ["+", "=", "-", "_", "0"].includes(e.key); // Ctrl +/−
    if (scroll.includes(e.key) || zoom) e.preventDefault();
  };
  document.body.style.overflow = "hidden";
  // wheel: cuộn + Ctrl/lăn chuột (phóng to); touchmove: vuốt + chụm 2 ngón
  window.addEventListener("wheel", block, { passive: false });
  window.addEventListener("touchmove", block, { passive: false });
  window.addEventListener("keydown", blockKeys);
  // Safari / iPhone: cử chỉ chụm phóng to riêng
  document.addEventListener("gesturestart", block);
  document.addEventListener("gesturechange", block);
  const ms = "mediaSession" in navigator ? navigator.mediaSession : null;
  const ACTIONS: MediaSessionAction[] = ["pause", "stop", "seekbackward", "seekforward", "seekto", "previoustrack", "nexttrack"];
  const setActions = (fn: (() => void) | null) =>
    ACTIONS.forEach((act) => {
      try {
        ms?.setActionHandler(act, fn);
      } catch {}
    });
  setActions(() => {});
  // chuyển tab, cuộc gọi đến… → quay lại thì phát tiếp
  const resume = () => !document.hidden && v?.paused && !v.ended && v.play().catch(() => {});
  document.addEventListener("visibilitychange", resume);
  v?.addEventListener("pause", resume);

  return () => {
    document.body.style.overflow = "";
    window.removeEventListener("wheel", block);
    window.removeEventListener("touchmove", block);
    window.removeEventListener("keydown", blockKeys);
    document.removeEventListener("gesturestart", block);
    document.removeEventListener("gesturechange", block);
    setActions(null);
    document.removeEventListener("visibilitychange", resume);
    v?.removeEventListener("pause", resume);
  };
}
