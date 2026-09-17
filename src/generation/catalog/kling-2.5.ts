import { videoModel } from "./defaults";
import type { ModelEntry } from "./types";

export const kling25: ModelEntry = {
  ...videoModel("kling-2.5", "Kling 2.5", { start: 1 }, {
    image: "kling-video/v2.5-turbo/standard/image-to-video",
  }),
  cost: { unit: "second", milliCents: 35 },
};
