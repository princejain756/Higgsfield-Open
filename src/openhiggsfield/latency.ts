import type { Surface } from "@/generation/catalog";

import { idbKv, type Kv } from "./idb";

/* What the studio has actually waited, so the progress tile can promise
   something better than a spinner. Samples are the run's own wall-clock
   duration, recorded only when the platform delivered — a failure says nothing
   about how long a success takes, and folding it in would drag every estimate
   down. Persisted under one key through the same IDB the run log uses. */

export const LATENCY_KEY = "latency.v1";
const MAX_SAMPLES = 200;
/* Below this the model's own history is too thin to quote; the surface it
   shares with its siblings is the broader — and honest — fallback. */
const MIN_FOR_MODEL = 5;

export type LatencySample = {
  modelId: string;
  surface: Surface;
  ms: number;
};

export type LatencyEstimate = {
  /** Median duration, ms. */
  p50: number;
  /** Ninth decile, ms — the edge of "normal" for this studio. */
  p90: number;
  /** Samples behind the estimate. Below MIN_FOR_MODEL the tile shows a range. */
  n: number;
  source: "model" | "surface" | "prior";
};

/* A first visit has no history at all, so the tile leans on these until its own
   runs replace them. Deliberately loose: an estimate that is early is worse
   than one that is wide. */
const PRIOR: Record<Surface, { p50: number; p90: number }> = {
  video: { p50: 60_000, p90: 150_000 },
  image: { p50: 15_000, p90: 40_000 },
};

/* Read once per session; the ring is small enough to keep in memory and the log
   is only ever appended by this module. */
let cache: LatencySample[] | null = null;

function isSample(value: unknown): value is LatencySample {
  if (value === null || typeof value !== "object") return false;
  const sample = value as Partial<LatencySample>;
  return (
    typeof sample.modelId === "string" &&
    (sample.surface === "image" || sample.surface === "video") &&
    typeof sample.ms === "number" &&
    Number.isFinite(sample.ms) &&
    sample.ms > 0
  );
}

export async function loadSamples(kv: Kv = idbKv()): Promise<LatencySample[]> {
  if (cache) return cache;
  try {
    const stored = await kv.get<unknown>(LATENCY_KEY);
    cache = Array.isArray(stored) ? stored.filter(isSample).slice(-MAX_SAMPLES) : [];
  } catch {
    cache = [];
  }
  return cache;
}

export async function recordDuration(sample: LatencySample, kv: Kv = idbKv()): Promise<void> {
  if (!isSample(sample)) return;
  const samples = await loadSamples(kv);
  const next = [...samples, sample].slice(-MAX_SAMPLES);
  cache = next;
  try {
    await kv.set(LATENCY_KEY, next);
  } catch {
    /* Private mode or a denied store: the estimate simply resets next session. */
  }
}

/** Sorted-sample quantile with linear interpolation — no dependency, and exact
    on the handful of samples a fresh studio actually has. */
function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return sorted[lo]!;
  return sorted[lo]! + (sorted[hi]! - sorted[lo]!) * (pos - lo);
}

export function estimateFrom(
  samples: readonly LatencySample[],
  modelId: string,
  surface: Surface,
): LatencyEstimate {
  const forModel = samples
    .filter((sample) => sample.modelId === modelId && sample.surface === surface)
    .map((sample) => sample.ms)
    .sort((a, b) => a - b);
  if (forModel.length >= MIN_FOR_MODEL) {
    return {
      p50: quantile(forModel, 0.5),
      p90: quantile(forModel, 0.9),
      n: forModel.length,
      source: "model",
    };
  }

  const forSurface = samples
    .filter((sample) => sample.surface === surface)
    .map((sample) => sample.ms)
    .sort((a, b) => a - b);
  if (forSurface.length >= MIN_FOR_MODEL) {
    return {
      p50: quantile(forSurface, 0.5),
      p90: quantile(forSurface, 0.9),
      n: forSurface.length,
      source: "surface",
    };
  }

  const prior = PRIOR[surface];
  return { p50: prior.p50, p90: prior.p90, n: forModel.length, source: "prior" };
}

export async function estimate(
  modelId: string,
  surface: Surface,
  kv: Kv = idbKv(),
): Promise<LatencyEstimate> {
  return estimateFrom(await loadSamples(kv), modelId, surface);
}
