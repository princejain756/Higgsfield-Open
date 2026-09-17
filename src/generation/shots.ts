import type { ModelEntry } from "./catalog";

/* Multi-angle shot grammar for a face-locked sequence. One press adds the
   phrase that frames the shot and pins the settings that hold it — so four
   clips of one character cut together because they were framed deliberately,
   not because they happened to share a model. */

export type ShotPreset = {
  label: string;
  /** The prompt fragment, joined with the existing prompt by appendCraft. */
  phrase: string;
  /** Catalog settings to pin. Filtered against the model before it is written,
      so a preset can name a duration a different model does not offer. */
  settings?: Record<string, unknown>;
};

export const SHOTS: readonly ShotPreset[] = [
  {
    label: "Close-Up",
    phrase: "tight close-up on the subject's face, shallow depth of field, eyes in focus",
    settings: { duration: 5 },
  },
  {
    label: "Low Angle Hero",
    phrase: "low-angle hero shot looking up at the subject, dramatic sky behind them",
    settings: { aspectRatio: "16:9", duration: 5 },
  },
  {
    label: "Tracking Profile",
    phrase: "tracking profile shot moving alongside the subject, side-on, steady pace",
    settings: { aspectRatio: "16:9", duration: 5 },
  },
  {
    label: "Wide Shot",
    phrase: "wide establishing shot, the subject small in a full environment",
    settings: { aspectRatio: "16:9", duration: 10 },
  },
];

/** The subset of a preset's settings the model actually declares and accepts.
    Anything else is dropped rather than thrown at parseSettings. */
export function validShotSettings(
  model: ModelEntry,
  shot: ShotPreset,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(shot.settings ?? {})) {
    const field = model.settings[key];
    if (!field) continue;
    if (field.type === "enum") {
      if (typeof value === "string" && field.values.includes(value)) out[key] = value;
      continue;
    }
    if (field.type === "range") {
      if (typeof value === "number" && value >= field.min && value <= field.max) out[key] = value;
      continue;
    }
    if (typeof value === "boolean") out[key] = value;
  }
  return out;
}
