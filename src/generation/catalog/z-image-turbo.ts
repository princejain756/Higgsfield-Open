import { imageModel } from "./defaults";
import type { ModelEntry } from "./types";

export const zImageTurbo: ModelEntry = {
  ...imageModel("z-image-turbo", "Z-Image Turbo", {
    text: "z-image/turbo",
  }),
  cost: { unit: "image", milliCents: 15 },
};
