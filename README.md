# OpenHiggsfield AI — Open-Source Alternative to Higgsfield AI

> **The free, open-source alternative to Higgsfield AI.** Generate images and
> videos with 38 models from one prompt bar — no closed ecosystem, no studio
> subscription.

## 🌐 Try it Online — No Install Required

**Live Production:** [higgsfield.prince.sh](https://higgsfield.prince.sh)

Image and Video in one studio, in the browser — zero markup, no setup. Add your
Higgsfield API credentials to start generating with Seedance 2.5 Face-Lock, 38 frontier models, and full mobile/tablet support. The studio itself is free.

---

**Why OpenHiggsfield AI instead of Higgsfield AI?**

- **Free & open-source** — no studio subscription, no vendor lock-in
- **Self-hosted** — clone it, run it, change it
- **Your key** — generate with your own platform key
- **38 models** — 8 image, 30 video, one catalog, one composer

---

Next.js 16 App Router on Vercel · React 19 · plain CSS · Zustand · pnpm

---

## Features

### Generate

- **One composer for Image and Video.** A single prompt bar drives both; the
  model you pick decides image or video. `⌘/Ctrl + Enter` submits.
- **38 models in the catalog** — 8 image, 30 video: Soul 2, Soul Cinema, Seedance
  2.5 (Edit / Extend), Seedance 2.0 (Fast / Mini), Kling 3 (Turbo / Std / Pro / 4K / Motion), Wan, Flux,
  Ideogram, Recraft, LTX, MiniMax, PixVerse, Grok, Qwen and more. Searchable
  picker.
- **Per-model settings.** Aspect ratio, resolution, duration, output format,
  audio, batch size, prompt enhancement — each model declares its own allow-list
  and the studio renders exactly that. No parallel hardcoded list.
- **Media inputs by role.** Start frame, end frame, references, video and audio,
  each with the per-role cap the model declares. Files upload to Vercel Blob and
  become public URLs the generate request can carry.
- **Asset picker.** Attach from your uploads library or from any finished run in
  history — two tabs over one library, filtered to the role's kind.
- **Batch.** Up to 4 results per press. Models with a native count setting use it;
  the rest are submitted once per result, each clearing its own tile.
- **Price, on the button.** Every model carries its platform rate in the catalog
  (thousandths of a dollar), so the composer shows the exact cost of the press
  before you make it — `≈ $0.495` for 5s of Seedance 2.5, `≈ $0.011` for a Soul 2
  image. A batch shows the arithmetic (`4 × ≈ $0.011 = ≈ $0.044`). Nothing is
  rounded to `$0.00`, and a model with no published rate shows no price rather
  than a fabricated zero. Rates as of September 2026; the platform bills you.
- **A confirm gate on costly batches.** Any press over $5.00 arms once and needs
  a second press — the arm state resets when the model, duration or count
  changes, so a price can never carry over to a different press.
- **Magic Pills.** A Craft panel beside the model picker drops camera moves
  (orbit, dolly, pan, drone), framing, lighting (golden hour, cinematic rim,
  studio softbox) and looks into the prompt as comma-joined fragments — nothing
  is overwritten. Per-model cheat sheets and a Surprise me, with one press to
  restore what you had.
- **Face-Lock continuity.** Build a character from reference stills (kept on
  device, capped at the model's own `reference` limit), then every subsequent run
  carries the same face. Shot presets — Close-Up, Low Angle Hero, Tracking
  Profile, Wide Shot — write both the framing phrase and the settings the model
  actually accepts.
- **Live run lifecycle.** Skeletons open in the grid on submit, the request is
  polled every 4s until a terminal status (10-minute deadline), and each finished
  result blooms into place on its own clock.
- **Honest progress.** Each running tile shows elapsed time, a progress bar on a
  saturating curve rather than a fake percentage, and a projected finish built
  from this browser's own completed runs (`p50`/`p90` per model, falling back to
  the surface, then to a prior). Under five samples it shows a range instead of a
  point. Past twice the ninetieth percentile it says "Taking longer than usual".
  Failed runs are excluded from the statistics.

### Gallery

- **Four scopes** — Image, Video, Assets (every finished run) and Favorites —
  as an arrow-key-navigable tab rail.
- **Masonry grid** of real runs at their true aspect ratio, newest first, with a
  gradient placeholder while media loads.
- **Per-tile actions**: reuse, favorite, delete, select.
- **Reuse restores model, settings and prompt**, so the same run can be
  re-rendered, not just re-typed.
- **Viewer.** Full-size media with prompt (copy in one click), model, resolved
  settings, timestamp, download, favorite and Recreate.
- **Selection mode.** Click a tile's checkbox to enter; shift-click extends a
  range. Bulk download (sequential, numbered, with progress and a report of any
  files the CDN refused), bulk favorite/unfavorite, bulk delete. The bar totals
  what the selection already cost (`Σ ≈ $0.86`), read off each record rather than
  recomputed. `Esc` exits.
- **Sequence preview.** Pick two or more finished runs and press play: the beats
  play in pick order with stills held for three seconds, videos advancing on
  their own end. Reorder beats with the arrows and export them numbered
  (`01-close-up.mp4`, `02-wide-shot.mp4`) so an editor or a shell concatenates
  them without renaming. ffmpeg is not involved — the files come out ordered, not
  muxed.
- **Undo.** Deletion is reversible for 6 seconds via a bar with a draining
  hairline, in the strip the composer already reserves.
- **Empty states** that hand you a starter prompt instead of a blank grid —
  no marketing loop, no carousel, no autoplaying showcase. The composer is the
  studio.
- **Changelog in the topbar.** Every shipped release, newest first, with an
  accent pip until the newest one has been read. The pip is a client fact and is
  stored in `localStorage`.

### State and errors

- **History persists** in IndexedDB in this browser (60 records). Favorites are
  a deliberate keep and never age out of the cap. Result URLs belong to the
  generation platform, so old history can outlive its CDN lifetime and show gaps.
- **Failed, NSFW and canceled runs** are recorded as failed tiles carrying the
  reason and a retry that restores the prompt and model.
- **Your own platform key.** Entered in a modal, stored by a server action in an
  httpOnly cookie. A missing key opens the modal — it never fails silently. The
  topbar lamp states whether a key is held and whether a run is in flight.

---

## Architecture

Each generate is one object: `{ model, prompt, media, settings }`.

- **The UI builds that object** and hands it to a server action. The action
  resolves it against the catalog and maps it to the generation API's own
  fields (`image_urls`, `aspect_ratio`, …).
- **Server actions are the only caller.** The browser never talks to the
  generation API. Submit is `POST /{model}`; status is
  `GET /requests/{id}/status`. Auth is `Authorization: Key <api_key>`.
- **The catalog is the source of truth** (`src/generation/catalog/`). A new entry
  appears in the picker, brings its own settings rail and media roles, and needs
  no studio changes.
- **Five small Zustand stores** — shared image/video prompt, shared image/video
  media, `settings[modelId]`, and a tiny `active` store — plus a character store
  for face-lock references. No store per model.
- **Latency statistics stay local.** Completed runs are recorded as
  `{ modelId, surface, ms }` in `localStorage` (`latency.v1`, 200 samples, ring
  buffer). Nothing is uploaded; the estimate hierarchy is model → surface → prior.
- **Uploads** go client-direct to Vercel Blob through `/api/blob`, which issues
  scoped tokens. `blob:` URLs are preview-only.

---

## Getting started

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Open the studio, press **Add key**, and paste the API key from
[Higgsfield Console](https://console.higgsfield.ai/api-keys).

> **Self-hosting note.** When `NODE_ENV=production` the key cookie is `secure`,
> so a browser silently drops it over plain HTTP: saving a key reports success
> but the studio comes back with no key. Serve over HTTPS, or run with
> `NODE_ENV=development` on localhost.

### Environment

```bash
HF_API_BASE_URL=                      # generation API origin, server only
OPEN_HIGGSFIELD_READ_WRITE_TOKEN=     # Vercel Blob read-write token
```

### Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server on port 3000 |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm brand` | Rebuild the icons and OG card in `public/` |

---

## Layout

```
src/
  app/          /  is the full-viewport studio and the only page
                /api/blob issues upload tokens
                base.css owns the document canvas
  generation/   generate requests, server actions, API mapping, catalog, stores
  openhiggsfield/
                the studio surface: composer, gallery, viewer, model picker,
                settings, asset picker, selection bar, character panel,
                sequence player, changelog — and openhiggsfield.css
  generation/shots.ts
                the multi-angle shot grammar shared by the composer and the
                craft panel
```

---

## Design principles

Dark studio ground, a single lime accent `#d1fe17`, Inter throughout. The chrome
stays neutral so the generated work is the only color on the surface.

1. **The tool disappears into the task** — expression never obscures state or
   affordance.
2. **Accent is state, not decoration** — selection, primary action, liveness only.
3. **Data is data** — settings, counts and durations read in tabular numerals.
   One typeface throughout; no monospace anywhere.
4. **Motion conveys state** — the generation lifecycle, the arrival of a run.
   Nothing loops decoratively.
5. **Every control ships all its states** — hover, focus, active, disabled,
   loading, error, empty.
6. **The catalog is the source of truth** — the studio renders what the model
   declares, never a parallel hardcoded list.

Built for people who work in long sessions, iterating on prompts, inputs and
settings.
