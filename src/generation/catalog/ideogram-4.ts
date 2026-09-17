import { imageModel } from "./defaults";
import type { ModelEntry } from "./types";

export const ideogram4: ModelEntry = {
  ...imageModel("ideogram-4", "Ideogram 4.0", {
    text: "ideogram/v4.0",
  }),
  cost: { unit: "image", milliCents: 30 },
};
