import { imageModel } from "./defaults";
import type { ModelEntry } from "./types";

export const recraft41: ModelEntry = {
  ...imageModel("recraft-4.1", "Recraft 4.1", {
    text: "recraft/v4.1/text-to-image",
  }),
  cost: { unit: "image", milliCents: 35 },
};
