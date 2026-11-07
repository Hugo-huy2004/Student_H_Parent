import Image, { type StaticImageData } from "next/image";
import { BackdropMotion } from "./motion";

import colonnade from "@/public/campus/colonnade-portrait.jpg";
import courtyard from "@/public/campus/courtyard.jpg";
import canary from "@/public/campus/canary-view.jpg";
import dome from "@/public/campus/dome.jpg";
import dusk from "@/public/campus/dusk-colonnade.jpg";
import park from "@/public/campus/park-view.jpg";
import domesNight from "@/public/campus/twin-domes-night.jpg";
import domesPath from "@/public/campus/twin-domes-path.jpg";

export const campus = { colonnade, courtyard, canary, dome, dusk, park, domesNight, domesPath };

/** Các ảnh khuôn viên lần lượt mờ dần chuyển qua nhau, phía sau phần mở đầu. */
const HERO_SLIDES: StaticImageData[] = [dusk, domesNight, domesPath, canary, courtyard];

export function HeroSlideshow() {
  return (
    <div className="hero-slides" aria-hidden>
      {HERO_SLIDES.map((src, i) => (
        <div key={src.src} className="slide" style={{ "--i": i } as React.CSSProperties}>
          <Image
            src={src}
            alt=""
            fill
            sizes="100vw"
            placeholder="blur"
            preload={i === 0}
            loading={i === 0 ? undefined : "lazy"}
          />
        </div>
      ))}
      <div className="veil" />
    </div>
  );
}

/** Một ảnh mờ, tan vào nền navy ở mép trên và dưới. */
export function Backdrop({ src, position = "center" }: { src: StaticImageData; position?: string }) {
  return (
    <BackdropMotion>
      <Image src={src} alt="" fill sizes="100vw" placeholder="blur" style={{ objectPosition: position }} />
    </BackdropMotion>
  );
}
