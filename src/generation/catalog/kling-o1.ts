import { videoModel } from "./defaults";
import type { ModelEntry } from "./types";

export const klingO1: ModelEntry = {
  ...videoModel("kling-o1", "Kling O1 (Omni)", { start: 1, end: 1 }, {
    firstLast: "kling-video/omni/first-last-frame",
  }),
  cost: { unit: "second", milliCents: 50 },
};
