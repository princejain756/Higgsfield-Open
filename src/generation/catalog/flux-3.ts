import { t2v, videoModel } from "./defaults";
import type { ModelEntry } from "./types";

export const flux3: ModelEntry = {
  ...videoModel(
    "flux-3",
    "Flux 3",
    { start: 1 },
    t2v("blackforestlabs/flux-3/text-to-video"),
  ),
  cost: { unit: "second", milliCents: 60 },
};
