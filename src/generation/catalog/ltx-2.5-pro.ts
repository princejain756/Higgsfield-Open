import { t2v, videoModel } from "./defaults";
import type { ModelEntry } from "./types";

export const ltx25Pro: ModelEntry = {
  ...videoModel(
    "ltx-2.5-pro",
    "LTX 2.5 Pro",
    { start: 1 },
    t2v("lightricks/ltx-2.5/text-to-video/pro"),
  ),
  cost: { unit: "second", milliCents: 120 },
};
