import { t2v, videoModel } from "./defaults";
import type { ModelEntry } from "./types";

export const kling26: ModelEntry = {
  ...videoModel(
    "kling-2.6",
    "Kling 2.6",
    { start: 1 },
    t2v("kling-video/v2.6/pro/text-to-video"),
  ),
  cost: { unit: "second", milliCents: 35 },
};
