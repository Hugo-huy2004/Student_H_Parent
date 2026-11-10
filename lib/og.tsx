import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** Ảnh chia sẻ link (Zalo, Messenger, Facebook…) — 1200 × 630, theo màn bìa thư mời, 100% tiếng Anh */
export const ogSize = { width: 1200, height: 630 };

const NIGHT = "#03124a";
const GOLD = "#dce6f7";
const SILVER = "#CBC9CC";
const GOLD_TEXT = "linear-gradient(180deg, #ffffff 0%, #dce6f7 26%, #8a98b6 50%, #f5f8fd 60%, #6c7b9c 84%, #e3e9f4 100%)";

const asset = (f: string) => readFile(join(process.cwd(), "assets/og", f));
const dataUri = (buf: Buffer, mime: string) => `data:${mime};base64,${buf.toString("base64")}`;

// Đọc một lần ở module scope (không phụ thuộc request)
const assets = Promise.all([
  asset("public-sans-latin-700-normal.woff"),
  asset("bodoni-moda-latin-500-normal.woff"),
  asset("eb-garamond-latin-400-italic.woff"),
  asset("bg.jpg"),
  asset("logo-white.svg"),
]);

/** Chữ vàng ánh kim (satori hỗ trợ background-clip: text) */
const gold = { backgroundImage: GOLD_TEXT, backgroundClip: "text", color: "transparent" } as const;

export async function renderInvitationOg() {
  const [sans, bodoni, garamond, bg, logo] = await assets;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: NIGHT, fontFamily: "Public Sans", color: "white" }}>
        {/* Ảnh khuôn viên mờ + lớp sương navy */}
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={dataUri(bg, "image/jpeg")} width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover", opacity: 0.45 }} />
        <div
          style={{
            // satori không hỗ trợ `inset` → khai báo kích thước tường minh
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage: "radial-gradient(70% 80% at 50% 50%, rgba(3,18,74,0.55), rgba(3,18,74,0.95))",
          }}
        />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "44px 64px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={dataUri(logo, "image/svg+xml")} width={176} height={64} style={{ alignSelf: "flex-start" }} />

          <div style={{ display: "flex", marginTop: 10, fontSize: 20, fontWeight: 700, letterSpacing: 8, color: GOLD, textTransform: "uppercase" }}>
            You are cordially invited
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 14, fontFamily: "Bodoni Moda", textTransform: "uppercase", lineHeight: 1 }}>
            <div style={{ display: "flex", fontSize: 92, ...gold }}>Student Honoring</div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 6 }}>
              <div style={{ display: "flex", fontSize: 92, ...gold }}>Ceremony</div>
              <div style={{ display: "flex", flexDirection: "column", marginLeft: 22, fontFamily: "Public Sans", fontWeight: 700, fontSize: 22, lineHeight: 1.2, color: GOLD, textTransform: "none" }}>
                <span>Summer</span>
                <span>2026</span>
                <span>Trimester</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", marginTop: 22, fontFamily: "EB Garamond", fontStyle: "italic", fontSize: 32, color: "#e8eefa" }}>
            Outstanding Student Recognition · University of Greenwich (Vietnam)
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: "auto", fontSize: 22 }}>
            <div style={{ display: "flex", width: 60, height: 1, background: GOLD, opacity: 0.7 }} />
            <div style={{ display: "flex", color: SILVER }}>Dear Parents</div>
            <div style={{ display: "flex", color: GOLD }}>·</div>
            <div style={{ display: "flex", fontWeight: 700 }}>Honouring Petrus Hugo Wishpax Le</div>
            <div style={{ display: "flex", width: 60, height: 1, background: GOLD, opacity: 0.7 }} />
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Public Sans", data: sans, weight: 700, style: "normal" },
        { name: "Bodoni Moda", data: bodoni, weight: 500, style: "normal" },
        { name: "EB Garamond", data: garamond, weight: 400, style: "italic" },
      ],
    }
  );
}
