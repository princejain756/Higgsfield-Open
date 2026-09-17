import { imageModel } from "./defaults";
import type { ModelEntry } from "./types";

export const flux2: ModelEntry = {
  ...imageModel("flux-2", "Flux 2", { text: "flux-2-pro" }),
  cost: { unit: "image", milliCents: 40 },
};
