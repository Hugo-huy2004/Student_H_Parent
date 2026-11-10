// Phông chữ dùng chung cho các phim (có bộ tiếng Việt nơi cần)
import { loadFont as loadBodoni } from "@remotion/google-fonts/BodoniModa";
import { loadFont as loadGaramond } from "@remotion/google-fonts/EBGaramond";
import { loadFont as loadPinyon } from "@remotion/google-fonts/PinyonScript";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadSans } from "@remotion/google-fonts/PublicSans";

export const didone = loadBodoni("normal", { weights: ["500"], subsets: ["latin"] }).fontFamily;
export const serif = loadGaramond("normal", { weights: ["400", "500"], subsets: ["latin", "vietnamese"] }).fontFamily;
loadGaramond("italic", { weights: ["400"], subsets: ["latin", "vietnamese"] }); // chữ nghiêng (fontStyle: italic)
export const sans = loadSans("normal", { weights: ["400", "700"], subsets: ["latin", "vietnamese"] }).fontFamily;
export const script = loadPinyon("normal", { weights: ["400"], subsets: ["latin", "vietnamese"] }).fontFamily;
// Bodoni Moda không có dấu tiếng Việt → chữ tiếng Việt kiểu Didone dùng Playfair Display
export const didoneVi = loadPlayfair("normal", { weights: ["500"], subsets: ["latin", "vietnamese"] }).fontFamily;
