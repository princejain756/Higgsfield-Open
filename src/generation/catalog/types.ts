export type Surface = "image" | "video";
export type MediaRole = "start" | "end" | "reference" | "video" | "audio";

export type MediaItem = {
  id: string;
  url: string;
  role: MediaRole;
};

export type SettingField =
  | { type: "enum"; values: readonly string[]; default: string }
  | { type: "range"; min: number; max: number; default: number; step?: number }
  | { type: "boolean"; default: boolean };

export type PlatformPaths = {
  text?: string;
  image?: string;
  firstLast?: string;
  reference?: string;
};

export type ModelEntry = {
  id: string;
  surface: Surface;
  label: string;
  roles: Partial<Record<MediaRole, number>>;
  settings: Record<string, SettingField>;
  /** Submit paths when the shared mapper is enough. Soul, Kling 3, and Seedance keep custom maps. */
  paths?: PlatformPaths;
  /** Published headline rate. Absent means the studio shows no price rather
      than inventing one — never "$0.00". */
  cost?: {
    unit: "generation" | "second" | "image";
    /** Rate in thousandths of a US dollar (mills): 99 is $0.099, 11 is $0.011.
        Integers keep the smallest rates exact instead of rounding them away. */
    milliCents: number;
  };
  /** True for entries whose reference inputs are meant to lock a face across
      shots (Seedance 2.5's US face inputs). */
  faceLock?: boolean;
};

export type GenerationPlane = {
  model: string;
  prompt: { text: string };
  media: Partial<Record<MediaRole, MediaItem[]>>;
  settings: Record<string, unknown>;
};
