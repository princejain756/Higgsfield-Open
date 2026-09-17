import { t2v, videoModel } from "./defaults";
import type { ModelEntry } from "./types";

export const ltx25Fast: ModelEntry = {
  ...videoModel(
    "ltx-2.5-fast",
    "LTX 2.5 Fast",
    { start: 1 },
    t2v("lightricks/ltx-2.5/text-to-video/fast"),
  ),
  cost: { unit: "second", milliCents: 90 },
};
