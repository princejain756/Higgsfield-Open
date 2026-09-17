import { t2v, videoModel } from "./defaults";
import type { ModelEntry } from "./types";

export const happyHorse1: ModelEntry = {
  ...videoModel(
    "happy-horse-1",
    "Happy Horse 1.0",
    { start: 1 },
    t2v("alibaba/happy-horse/text-to-video"),
  ),
  cost: { unit: "second", milliCents: 77 },
};
