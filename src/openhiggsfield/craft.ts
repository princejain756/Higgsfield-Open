import type { ModelEntry, Surface } from "@/generation/catalog";

/* One click, one phrase. The label is what the pill reads; insert is what lands
   in the prompt, so a pill can read short while adding a whole phrase. */
export type CraftTag = {
  label: string;
  insert: string;
};

export type CraftGroup = {
  title: string;
  tags: readonly CraftTag[];
};

export const CAMERA_MOVES: readonly CraftTag[] = [
  { label: "Dolly in", insert: "slow dolly-in on the subject" },
  { label: "Dolly out", insert: "slow dolly-out revealing the scene" },
  { label: "Orbit", insert: "camera orbits around the subject" },
  { label: "Pan", insert: "smooth pan across the scene" },
  { label: "Tilt up", insert: "slow tilt up from the ground to the subject" },
  { label: "Crane", insert: "crane up and over the scene" },
  { label: "Drone", insert: "aerial drone fly-through" },
  { label: "Tracking", insert: "tracking shot alongside the subject" },
  { label: "Push-in", insert: "very slow push-in" },
  { label: "Whip pan", insert: "whip pan with motion blur" },
  { label: "Rack focus", insert: "rack focus from foreground to background" },
  { label: "Dolly zoom", insert: "dolly zoom, background stretching" },
  { label: "Handheld", insert: "handheld camera, loose framing" },
  { label: "Steadicam", insert: "steadicam glide following the action" },
  { label: "FPV dive", insert: "FPV drone diving into the scene" },
  { label: "Locked-off", insert: "locked-off wide shot, no camera movement" },
];

export const FRAMING: readonly CraftTag[] = [
  { label: "Low angle", insert: "low angle looking up" },
  { label: "Top-down", insert: "top-down flat lay" },
  { label: "Close-up", insert: "extreme close-up crop" },
  { label: "Wide", insert: "wide establishing shot" },
  { label: "Over shoulder", insert: "over-the-shoulder framing" },
  { label: "Dutch angle", insert: "dutch angle, tilted horizon" },
  { label: "Symmetry", insert: "centered symmetrical composition" },
  { label: "Negative space", insert: "minimalist negative space" },
];

export const LIGHTING: readonly CraftTag[] = [
  { label: "Golden hour", insert: "warm golden hour light" },
  { label: "Blue hour", insert: "cool blue hour dusk" },
  { label: "Neon", insert: "neon signs, wet reflections" },
  { label: "Volumetric", insert: "volumetric light through haze" },
  { label: "Studio softbox", insert: "soft studio softbox light" },
  { label: "Cinematic rim", insert: "cinematic rim light separating the subject from the background" },
  { label: "Hard noon", insert: "hard noon sun, sharp shadows" },
  { label: "Chiaroscuro", insert: "chiaroscuro, single hard key light" },
  { label: "Sodium", insert: "orange sodium streetlight glow" },
  { label: "Moonlight", insert: "cool moonlight" },
  { label: "Practicals", insert: "warm practical lamps glowing in frame" },
  { label: "Overcast", insert: "flat soft overcast light" },
  { label: "Candlelight", insert: "flickering candlelight" },
];

export const STYLES: readonly CraftTag[] = [
  { label: "Anamorphic", insert: "anamorphic widescreen, 2.39:1" },
  { label: "35mm film", insert: "shot on 35mm film, fine grain" },
  { label: "85mm portrait", insert: "85mm portrait lens, shallow depth of field" },
  { label: "Macro", insert: "macro detail, extreme close focus" },
  { label: "Film noir", insert: "film noir, high-contrast black and white" },
  { label: "Pastel", insert: "muted pastel palette" },
  { label: "Teal & orange", insert: "teal and orange color grade" },
  { label: "Monochrome", insert: "monochrome with deep blacks" },
  { label: "Anime cel", insert: "anime cel style, hand-inked lines" },
  { label: "Claymation", insert: "stop-motion clay look" },
  { label: "VHS", insert: "worn VHS transfer, scan lines" },
  { label: "Watercolor", insert: "loose watercolor illustration" },
];

/** Video earns a camera group; images get framing instead. Both share light
    and style, which is where most of a prompt's character comes from anyway. */
export function groupsFor(surface: Surface): CraftGroup[] {
  if (surface === "video") {
    return [
      { title: "Camera move", tags: CAMERA_MOVES },
      { title: "Light", tags: LIGHTING },
      { title: "Look", tags: STYLES },
    ];
  }
  return [
    { title: "Framing", tags: FRAMING },
    { title: "Light", tags: LIGHTING },
    { title: "Look", tags: STYLES },
  ];
}

/* Tips are matched by family, most specific first. Every line is either
   verifiable against the catalog entry (durations, counts, toggles) or plain
   craft that holds for any platform — nothing is promised that the studio
   cannot see in its own settings. */
const MODEL_TIP_FAMILIES: ReadonlyArray<{ match: RegExp; tips: readonly string[] }> = [
  {
    match: /^seedance-2\.5/,
    tips: [
      "Lead with the action and the camera move — Seedance follows shot grammar closely.",
      "Attach face or wardrobe references, then keep the prompt about what happens, not who they are.",
      "Clips run 4–30 seconds: say what changes over time, not just the opening frame.",
    ],
  },
  {
    match: /^seedance-2/,
    tips: [
      "One camera move per clip reads cleanest — stack two and both go muddy.",
      "It takes up to 9 references and clips of 4–15 seconds.",
      "Native audio is on by default; name the sounds you want to hear.",
    ],
  },
  {
    match: /^kling-3/,
    tips: [
      "The CFG slider sits at 0–1: lower follows your words more literally, higher improvises.",
      "Give a start and an end frame for a controlled transition between the two.",
      "Sound is a toggle — leave it on and describe the ambience you want.",
      "Multi-shot produces varied takes of the same prompt; judge them side by side.",
    ],
  },
  {
    match: /^kling-o/,
    tips: [
      "Built for first-and-last-frame work: name where the shot starts and where it lands.",
      "Keep both frames the same subject, or the bridge between them turns abstract.",
    ],
  },
  {
    match: /^kling/,
    tips: [
      "Short clips reward single, deliberate moves — a slow push-in beats a choreography.",
      "Describe the subject first, the motion second, the mood last.",
    ],
  },
  {
    match: /^wan/,
    tips: [
      "Strong with continuous physical action: weather, water, fabric, crowds.",
      "Write one unbroken action sentence rather than a list of cuts.",
    ],
  },
  {
    match: /^minimax/,
    tips: [
      "Direct it like a scene: name the emotion of the beat, not just the blocking.",
      "Facial performance holds up — give the character something to react to.",
    ],
  },
  {
    match: /^soul/,
    tips: [
      "Made for portrait and studio work; light words do the heavy lifting.",
      "Enhance prompt off keeps your exact words; on, it expands them.",
      "Batch of 4 is the fast way to pick a keeper from one idea.",
    ],
  },
  {
    match: /^flux/,
    tips: [
      "Reads long natural sentences well — describe the scene, not keywords.",
      "Keep style words beside the subject they apply to.",
    ],
  },
  {
    match: /^recraft/,
    tips: [
      "At home with flat design, logos, icons and brand illustration.",
      "Name the medium precisely: vector sticker, risograph print, line art.",
    ],
  },
  {
    match: /^grok/,
    tips: [
      "Reference-to-video: attach up to 8 references and describe the motion between them.",
      "Say what stays fixed — identity, wardrobe — and what moves.",
    ],
  },
  {
    match: /^ltx/,
    tips: [
      "Fast enough to draft with: nail the framing here, finish on a heavier model.",
      "Simple prompts with one clear subject come back cleanest.",
    ],
  },
  {
    match: /^pixverse/,
    tips: [
      "Leans stylized and expressive — one effect per clip keeps it readable.",
      "Camera-shake and speed words land harder than long scene descriptions.",
    ],
  },
  {
    match: /^happy-horse/,
    tips: [
      "Expressive, stylized motion — playful prompts play to its strengths.",
      "Keep the cast small: one or two subjects, one clear action.",
    ],
  },
  {
    match: /^dop/,
    tips: [
      "It thinks like a cinematographer — camera and light vocabulary goes far.",
      "Name the lens and the key light before the story beat.",
    ],
  },
];

const SURFACE_TIPS: Record<Surface, readonly string[]> = {
  video: [
    "One move per shot: a slow dolly-in reads better than three moves at once.",
    "Say what changes over time — arrivals, turns, reveals — not just the first frame.",
    "Name the light before the mood; the grade follows the light.",
  ],
  image: [
    "Front-load the subject: who or what, doing what, in the first few words.",
    "Name the light — golden hour, softbox, neon — and the picture half-draws itself.",
    "A lens is a distance: 85mm is close and flattering, 24mm pulls the room in.",
  ],
};

export function tipsFor(model: ModelEntry): readonly string[] {
  return (
    MODEL_TIP_FAMILIES.find((family) => family.match.test(model.id))?.tips ??
    SURFACE_TIPS[model.surface]
  );
}

/* ---------- surprise me ----------

   Combinatorial, not a fixed list: subjects crossed with light, lens and style
   give thousands of coherent prompts, so the button keeps paying off. Called
   from a press, never during render — the server would deal a different hand. */

const VIDEO_SUBJECTS = [
  "a cellist playing to an empty underground platform",
  "a courier weaving through monsoon traffic on a scooter",
  "an astronomer climbing a snowbound ridge to a dome observatory",
  "a street chef tossing noodles over open flame at midnight",
  "a freediver descending past a shaft of sunlight",
  "a violinist practicing in a rain-lashed greenhouse",
  "a mechanic rolling a vintage motorcycle out of a corrugated shed",
  "a dancer rehearsing alone in a mirrored warehouse",
  "a shepherd crossing a stone bridge with his flock at first light",
  "a barista closing up a corner café as the neon flickers on",
  "a paper-maker laying sheets to dry in a courtyard",
  "a lighthouse keeper walking the gallery deck in heavy wind",
];

const IMAGE_SUBJECTS = [
  "a beekeeper in a sunlit orchard, veil catching the light",
  "a brutalist concrete stairwell with a single red umbrella",
  "an elderly luthier holding a half-built violin",
  "a tidal salt pond drawn in pink and ochre geometry",
  "a market stall of heirloom tomatoes under striped canvas",
  "a test pilot standing beside a chrome-bellied prototype",
  "a moss-covered stone shrine off a forest trail",
  "a night bakery seen through fogged glass",
  "a wind farm on a coastal headland at dusk",
  "a stack of ceramic bowls on wet slate, steam curling",
  "a retrospective cyclist crossing an empty rain-slick junction",
  "a desert observatory under early star trails",
];

const VIDEO_LIGHT = [
  "dawn fog diffusing the sun",
  "hard noon light, sharp shadows",
  "neon signage and wet asphalt reflections",
  "golden hour raking through dust",
  "cool moonlight with practical lamps in frame",
  "overcast silver light",
  "candlelight against deep shadow",
  "sodium streetlamps after rain",
];

const IMAGE_LIGHT = [
  "soft window light",
  "hard single-source key with deep falloff",
  "warm golden hour backlight",
  "flat overcast light",
  "neon spill on wet surfaces",
  "studio softbox with a subtle rim light",
  "early morning haze",
  "candlelit warmth against darkness",
];

const LENS = [
  "35mm",
  "50mm",
  "85mm portrait lens, shallow depth of field",
  "wide 24mm",
  "macro close focus",
  "long telephoto compression",
];

const FINISH = [
  "shot on 35mm film, fine grain",
  "anamorphic widescreen",
  "muted natural palette",
  "high-contrast monochrome",
  "teal and orange grade",
  "documentary realism",
];

function pick<T>(pool: readonly T[]): T {
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function surprisePrompt(surface: Surface): string {
  if (surface === "video") {
    return `${pick(CAMERA_MOVES).insert} — ${pick(VIDEO_SUBJECTS)}, ${pick(
      VIDEO_LIGHT,
    )}, ${pick(FINISH)}`;
  }
  return `${pick(IMAGE_SUBJECTS)}, ${pick(IMAGE_LIGHT)}, ${pick(LENS)}, ${pick(FINISH)}`;
}

/* ---------- insertion ----------

   One separator rule for every pill: trim whatever the text trails in, join
   with a single comma-space. An empty field just takes the phrase. */
export function appendCraft(current: string, insert: string): string {
  const base = current.trim().replace(/[,\s]+$/, "");
  return base ? `${base}, ${insert}` : insert;
}
