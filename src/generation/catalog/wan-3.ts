import { t2v, videoModel } from "./defaults";
import type { ModelEntry } from "./types";

export const wan3: ModelEntry = {
  ...videoModel("wan-3", "Wan 3.0", { start: 1 }, t2v("alibaba/wan-3.0/text-to-video")),
  cost: { unit: "second", milliCents: 30 },
};
