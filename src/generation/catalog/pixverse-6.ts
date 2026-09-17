import { t2v, videoModel } from "./defaults";
import type { ModelEntry } from "./types";

export const pixverse6: ModelEntry = {
  ...videoModel("pixverse-6", "PixVerse 6", { start: 1 }, t2v("pixverse/v6/text-to-video")),
  cost: { unit: "second", milliCents: 98 },
};
