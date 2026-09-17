import { videoModel } from "./defaults";
import type { ModelEntry } from "./types";

export const grokImagineVideo15: ModelEntry = {
  ...videoModel(
    "grok-imagine-video-1.5",
    "Grok Imagine Video 1.5",
    { reference: 8, video: 3 },
    { reference: "xai/grok-imagine-video/v1.5/reference-to-video" },
  ),
  cost: { unit: "second", milliCents: 80 },
};
