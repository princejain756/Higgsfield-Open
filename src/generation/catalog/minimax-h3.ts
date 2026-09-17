import { t2v, videoModel } from "./defaults";
import type { ModelEntry } from "./types";

export const minimaxH3: ModelEntry = {
  ...videoModel("minimax-h3", "MiniMax H3", { start: 1 }, t2v("minimax/h3/text-to-video")),
  cost: { unit: "second", milliCents: 72 },
};
