import { t2v, videoModel } from "./defaults";
import type { ModelEntry } from "./types";

export const happyHorse11: ModelEntry = {
  ...videoModel(
    "happy-horse-1.1",
    "Happy Horse 1.1",
    { start: 1 },
    t2v("alibaba/happy-horse/v1.1/text-to-video"),
  ),
  cost: { unit: "second", milliCents: 77 },
};
