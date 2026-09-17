import { imageModel } from "./defaults";
import type { ModelEntry } from "./types";

export const grokImagine2: ModelEntry = {
  ...imageModel("grok-imagine-2", "Grok Imagine 2.0", {
    text: "xai/grok-imagine-image-2.0",
  }),
  cost: { unit: "image", milliCents: 40 },
};
