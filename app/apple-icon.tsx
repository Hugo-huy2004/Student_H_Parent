import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Icon khi lưu trang ra màn hình chính iPhone: la bàn Greenwich trên nền navy
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const compass = readFile(join(process.cwd(), "assets/og/compass.svg"));

export default async function AppleIcon() {
  const svg = (await compass).toString("base64");
  return new ImageResponse(
    // Nền navy kín cả ô (iOS tự bo góc)
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#03124a" }}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img src={`data:image/svg+xml;base64,${svg}`} width={180} height={180} />
    </div>,
    size
  );
}
