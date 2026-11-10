import { Composition } from "remotion";
import { DressCodeFilm, DURATION_S, FPS } from "./DressCodeFilm";
import { IntroFilm } from "./intro/IntroFilm";
import * as Intro from "./intro/timeline";

export const Root = () => (
  <>
    <Composition id="Intro" component={IntroFilm} durationInFrames={Intro.DURATION_S * Intro.FPS} fps={Intro.FPS} width={1080} height={1920} />
    <Composition id="DressCode" component={DressCodeFilm} durationInFrames={DURATION_S * FPS} fps={FPS} width={1080} height={1920} />
  </>
);
