import { t2v, videoModel } from "./defaults";
import type { ModelEntry } from "./types";

export const wan27: ModelEntry = {
  ...videoModel("wan-2.7", "Wan 2.7", { start: 1 }, t2v("wan/v2.7/text-to-video")),
  cost: { unit: "second", milliCents: 100 },
};
