import { t2v, videoModel } from "./defaults";
import type { ModelEntry } from "./types";

export const minimaxHailuo23: ModelEntry = {
  ...videoModel(
    "minimax-hailuo-2.3",
    "MiniMax Hailuo 2.3",
    { start: 1 },
    t2v("minimax/hailuo-2.3/standard/text-to-video"),
  ),
  cost: { unit: "second", milliCents: 28 },
};
