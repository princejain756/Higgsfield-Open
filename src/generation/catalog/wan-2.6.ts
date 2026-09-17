import { t2v, videoModel } from "./defaults";
import type { ModelEntry } from "./types";

export const wan26: ModelEntry = {
  ...videoModel("wan-2.6", "Wan 2.6", { start: 1 }, t2v("wan/v2.6/text-to-video")),
  cost: { unit: "second", milliCents: 20 },
};
