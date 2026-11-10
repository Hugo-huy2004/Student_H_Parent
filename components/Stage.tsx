// Đèn chiếu + sao lấp lánh 4 cánh phủ lên nền (theo key visual Student Honoring Ceremony).
// Toàn bộ là CSS, không dùng ảnh.

/** Lớp trang trí phủ trên ảnh nền: đèn chiếu mờ + các tia sao loé sáng */
export default function Stage() {
  return (
    <div className="stage" aria-hidden>
      <div className="beam beam-1" />
      <div className="beam beam-2" />
      <div className="beam beam-3" />
      <span className="flare f1" />
      <span className="flare f2" />
      <span className="flare f3" />
      <span className="flare f4" />
    </div>
  );
}
