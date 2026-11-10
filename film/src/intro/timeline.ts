/**
 * Mốc thời gian phim intro (giây). Lời đọc (public/voice/intro.mp3) vào ở VOICE_AT;
 * các mốc lời đọc đo bằng khoảng lặng (ffmpeg silencedetect) rồi cộng VOICE_AT.
 */
export const FPS = 30;
export const VOICE_AT = 2.5;
export const DURATION_S = 40;

const v = (s: number) => s + VOICE_AT; // giây trong file giọng → giây trong phim

export const T = {
  ignite: [0, 2.5], // chấm sáng loé lên
  tunnel: [2.0, 6.6], // lao qua đường hầm ánh sáng
  galaxy: [5.6, 14.2], // ngân hà + chòm sao
  constellation: [7.4, 12.6], // nét sáng nối thành hình ngôi sao
  shards: [13.6, 17.27], // 16 mảnh pha lê bay tới
  assemble: v(14.77), // "…thành một ngôi sao pha lê" → khớp + loé
  orbit: [17.4, 22.0], // camera bay vòng quanh ngôi sao
  shine: v(17.2), // "Toả sáng… rực rỡ nhất"
  title: [v(19.67), v(26.26)], // đường sáng cắt → lộ chữ
  info: [v(26.26), v(31.2)], // tấm kính thông tin
  outro: [v(30.6), DURATION_S], // thu về logo
} as const;

/** Phụ đề: [giây trong phim, câu] */
export const CAPTIONS: [number, string][] = [
  [v(0.0), "Mỗi ngôi sao…"],
  [v(1.54), "…đều bắt đầu từ một tia sáng nhỏ."],
  [v(4.6), "Tia sáng ấy được nuôi lớn bằng những đêm Bố Mẹ thức cùng con,"],
  [v(8.79), "bằng niềm tin…"],
  [v(9.92), "chưa bao giờ tắt."],
  [v(11.66), "Và hôm nay,"],
  [v(12.77), "từng mảnh nỗ lực đã hợp lại,"],
  [v(14.77), "thành một ngôi sao pha lê."],
  [v(16.84), "Toả sáng…"],
  [v(17.97), "rực rỡ nhất."],
  [v(19.67), "Trân trọng kính mời Bố Mẹ đến dự Lễ Tôn vinh Sinh viên Xuất sắc, kỳ Summer 2026."],
  [v(26.26), "Mười tám giờ, ngày 17 tháng 11,"],
  [v(28.76), "tại Hội trường Greenwich Việt Nam."],
  [v(31.2), "Vì con được toả sáng…"],
  [v(32.7), "…là nhờ có Bố Mẹ."],
];
export const VOICE_END = v(34.1);

export const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
export const at = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
