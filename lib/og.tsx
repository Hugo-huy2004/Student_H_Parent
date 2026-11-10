import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** Ảnh chia sẻ link (Zalo, Messenger, Facebook…) — 1200 × 630, theo màn bìa thư mời, 100% tiếng Anh */
export const ogSize = { width: 1200, height: 630 };

const SILVER = "linear-gradient(180deg, #ffffff 0%, #e6eefb 30%, #9fb3d6 52%, #ffffff 64%, #b9c8e4 100%)";
const ICE = "#dce8fb";

const asset = (f: string) => readFile(join(process.cwd(), "assets/og", f));
const dataUri = (buf: Buffer, mime: string) => `data:${mime};base64,${buf.toString("base64")}`;

// Đọc một lần ở module scope (không phụ thuộc request)
const assets = Promise.all([
  asset("public-sans-latin-700-normal.woff"),
  asset("bodoni-moda-latin-500-normal.woff"),
  asset("pinyon-script-latin-400-normal.woff"),
  asset("star-fade.png"),
  asset("logo-white.svg"),
]);

/** Chữ bạc ánh kim (satori hỗ trợ background-clip: text) */
const silver = { backgroundImage: SILVER, backgroundClip: "text", color: "transparent" } as const;

export async function renderInvitationOg() {
  const [sans, bodoni, script, star, logo] = await assets;
  const W = 1200, H = 630;

  return new ImageResponse(
    (
      <div style={{ width: W, height: H, display: "flex", fontFamily: "Public Sans", color: "white", backgroundImage: "linear-gradient(115deg, #03124a 0%, #0a2d8a 48%, #2a6fd6 100%)" }}>
        {/* Ngôi sao pha lê, viền mờ hoà vào nền */}
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={dataUri(star, "image/png")}
          width={600}
          height={600}
          style={{ position: "absolute", top: 15, left: 640, width: 600, height: 600 }}
        />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", width: 720, height: H, padding: "48px 0 44px 64px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={dataUri(logo, "image/svg+xml")} width={176} height={64} />

          <div style={{ display: "flex", flexDirection: "column", marginTop: 34, fontFamily: "Bodoni Moda", lineHeight: 0.9 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", fontSize: 104, ...silver }}>STUDENT</div>
              <div style={{ display: "flex", flexDirection: "column", marginLeft: 18, fontFamily: "Public Sans", fontWeight: 700, fontSize: 17, lineHeight: 1.25, letterSpacing: 2, color: ICE }}>
                <span>TRIMESTER</span>
                <span>SUMMER</span>
                <span>2026</span>
              </div>
            </div>
            <div style={{ display: "flex", fontSize: 104, marginTop: 4, ...silver }}>HONORING</div>
            <div style={{ display: "flex", marginTop: -34, marginLeft: 190, fontFamily: "Pinyon Script", fontSize: 112, lineHeight: 1.2, color: "#ffffff" }}>Ceremony</div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: "auto", fontSize: 24, color: ICE }}>
            <span>18:00</span>
            <span style={{ opacity: 0.6 }}>·</span>
            <span>17.11.2026</span>
            <span style={{ opacity: 0.6 }}>·</span>
            <span>Hall of Greenwich Vietnam</span>
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Public Sans", data: sans, weight: 700, style: "normal" },
        { name: "Bodoni Moda", data: bodoni, weight: 500, style: "normal" },
        { name: "Pinyon Script", data: script, weight: 400, style: "normal" },
      ],
    }
  );
}
