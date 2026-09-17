import { videoModel } from "./defaults";
import type { ModelEntry } from "./types";

export const klingO3: ModelEntry = {
  ...videoModel("kling-o3", "Kling O3", { start: 1, end: 1 }, {
    firstLast: "kling-video/o3/first-last-frame",
  }),
  cost: { unit: "second", milliCents: 42 },
};
