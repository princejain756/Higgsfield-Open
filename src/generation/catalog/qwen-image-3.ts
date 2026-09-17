import { imageModel } from "./defaults";
import type { ModelEntry } from "./types";

export const qwenImage3: ModelEntry = {
  ...imageModel("qwen-image-3", "Qwen Image 3", {
    text: "alibaba/qwen-image-3/text-to-image",
  }),
  cost: { unit: "image", milliCents: 40 },
};
