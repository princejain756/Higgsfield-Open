import { t2v, videoModel } from "./defaults";
import type { ModelEntry } from "./types";

export const wan3Prime: ModelEntry = {
  ...videoModel(
    "wan-3-prime",
    "Wan 3.0 Prime",
    { start: 1 },
    t2v("alibaba/wan-3.0-prime/text-to-video"),
  ),
  cost: { unit: "second", milliCents: 48 },
};
