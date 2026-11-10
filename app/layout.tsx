import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, EB_Garamond, Pinyon_Script, Playfair_Display, Public_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "700"],
});

// Serif cho tiêu đề & dòng tiếng Anh — cảm giác thiệp in kiểu Anh
const garamond = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// Didone cao tương phản cho tiêu đề "Student Honoring Ceremony" (chỉ chữ Latin)
const bodoni = Bodoni_Moda({
  variable: "--font-didone",
  subsets: ["latin"],
  weight: ["500"],
});

// Bodoni Moda không có dấu tiếng Việt → chữ tiếng Việt kiểu Didone dùng Playfair Display
const playfair = Playfair_Display({
  variable: "--font-didone-vi",
  subsets: ["latin", "vietnamese"],
  weight: ["500"],
});

// Chữ viết tay cho "Ceremony" (theo key visual)
const pinyon = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin", "vietnamese"],
  weight: "400",
});

// CooperHewitt chỉ có bộ Latin cơ bản → dùng cho chữ số và nhãn không dấu
const cooperHewitt = localFont({
  variable: "--font-cooper",
  src: [
    { path: "./fonts/cooper-hewitt-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/cooper-hewitt-latin-700-normal.woff2", weight: "700" },
  ],
});

export const metadata: Metadata = {
  // Domain thật của trang (để link ảnh chia sẻ là URL tuyệt đối). Đặt SITE_URL khi deploy.
  metadataBase: new URL(process.env.SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:2705")),
  title: "Invitation · Student Honoring Ceremony · Summer 2026",
  description:
    "Dear Parents, you are cordially invited to the Student Honoring Ceremony, Summer 2026 Trimester, at the University of Greenwich (Vietnam), honouring Petrus Hugo Wishpax Le.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "University of Greenwich (Vietnam) · Invitation",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#03124a",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${publicSans.variable} ${cooperHewitt.variable} ${garamond.variable} ${bodoni.variable} ${playfair.variable} ${pinyon.variable}`}>
      <body>{children}</body>
    </html>
  );
}
