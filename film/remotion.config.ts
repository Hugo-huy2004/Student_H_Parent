import { Config } from "@remotion/cli/config";

Config.setEntryPoint("src/index.ts");
// WebGL cho phần 3D của phim intro
Config.setChromiumOpenGlRenderer("angle");
