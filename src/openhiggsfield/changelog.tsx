"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react";

import { CloseIcon } from "./icons";

export const RELEASE = "1.5";

export type ReleaseEntry = {
  version: string;
  date: string;
  title: string;
  /** One line per shipped thing, newest entry first in the array. */
  notes: readonly string[];
  fresh?: boolean;
};

export const RELEASES: readonly ReleaseEntry[] = [
  {
    version: "1.5",
    date: "September 2026",
    title: "The professional studio",
    notes: [
      "Every price is on the button before you press it — exact platform rates per generation, in cents, with no rounding to zero.",
      "A real progress tracker on every running tile: elapsed time, a projected finish, and an honest word when a run outlives its usual window.",
      "Face-Lock continuity — build a character once from stills, then reuse the same face across shots, with angles and framing applied in a press.",
      "Shot presets and Magic Pills for camera moves and lighting drop straight into the prompt, matched to each model's real settings.",
      "Sequence preview plays your picks in order, lets you rearrange the beats, and exports them numbered so they stay in order.",
      "This changelog, in the top bar. The marketing loop, the ticker and the neon are gone — what is left is the work.",
    ],
    fresh: true,
  },
  {
    version: "1.4",
    date: "September 2026",
    title: "Prompt craft, in the composer",
    notes: [
      "New Craft panel beside the model picker: camera moves, framing, lighting and looks that drop into your prompt with one click.",
      "Per-model cheat sheets — how to prompt Seedance 2.5, Kling 3.0, Wan 3.0 and the rest, written against each model's real settings.",
      "Surprise me deals a fresh, fully-formed prompt for the surface you are on; your previous words are one press away.",
      "Copy link in the viewer shares the studio, and Copy prompt already shares the words.",
      "The model picker now states the facts plainly: every catalog model, direct API, zero markup.",
    ],
  },
  {
    version: "1.3",
    date: "August 2026",
    title: "Credentials, without the friction",
    notes: [
      "Dual Key ID + Secret Key authentication with smart auto-split paste — paste both fields in one go and they sort themselves.",
      "A hardened React 19 server boundary around submission: failures surface as messages, never as a crashed studio.",
    ],
  },
  {
    version: "1.2",
    date: "July 2026",
    title: "Seedance 2.5 and a fuller catalog",
    notes: [
      "Seedance 2.5 with US face inputs — attach references and direct the performance in plain language.",
      "38 frontier models across video and image, every one of them reachable from the same composer.",
    ],
  },
  {
    version: "1.1",
    date: "June 2026",
    title: "Costs, side by side",
    notes: [
      "Live benchmark table against Runway, Luma and Kling — per-generation prices, not subscription math.",
    ],
  },
  {
    version: "1.0",
    date: "May 2026",
    title: "The open studio",
    notes: [
      "Launch: a zero-markup BYOK studio — your platform key, your costs, no platform fee on top.",
      "The full codebase is open source; what runs in your browser is what you can read.",
    ],
  },
];

const SEEN_KEY = "openhiggsfield.releaseSeen";

/* The pip is a client fact — the server cannot know what this visitor has read
   — so the stored version is read in an effect, never during render. */
export function useUnreadRelease(): { unread: boolean; markSeen: () => void } {
  const [unread, setUnread] = useState(false);

  useEffect(() => {
    try {
      setUnread(window.localStorage.getItem(SEEN_KEY) !== RELEASE);
    } catch {
      setUnread(true);
    }
  }, []);

  const markSeen = useCallback(() => {
    setUnread(false);
    try {
      window.localStorage.setItem(SEEN_KEY, RELEASE);
    } catch {
      /* Private mode and full quotas both land here; the pip simply stays
         honest for this visit and stops trying to remember. */
    }
  }, []);

  return { unread, markSeen };
}

export function ChangelogModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="ohf-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="What's new">
      <div className="ohf-modal-panel ohf-release-panel" onClick={(event) => event.stopPropagation()}>
        <div className="ohf-modal-header">
          <div className="ohf-pricing-headline">
            <span className="ohf-award-badge">
              <Icon
                icon="lucide:megaphone"
                width="13"
                height="13"
                style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "5px" }}
              />
              Update log
            </span>            <h2 className="ohf-modal-title">What&rsquo;s new</h2>
            <p className="ohf-modal-desc">
              Every shipped change to the studio, newest first. The code behind each line is in the
              repository.
            </p>
          </div>
          <button type="button" className="ohf-icon-btn ohf-icon-btn--ghost" onClick={onClose} aria-label="Close">
            <CloseIcon size={14} />
          </button>
        </div>

        <ol className="ohf-release-list">
          {RELEASES.map((entry) => (
            <li key={entry.version} className="ohf-release" data-fresh={entry.fresh || undefined}>
              <div className="ohf-release-rail">
                <span className="ohf-release-dot" aria-hidden />
                <span className="ohf-release-version">v{entry.version}</span>
              </div>
              <div className="ohf-release-body">
                <h3 className="ohf-release-title">
                  {entry.title}
                  {entry.fresh && <span className="ohf-release-chip">New</span>}
                </h3>
                <span className="ohf-release-date">{entry.date}</span>
                <ul className="ohf-release-notes">
                  {entry.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <div className="ohf-pricing-footer">
          <div className="ohf-pricing-footnote">
            <Icon
              icon="lucide:sparkles"
              width="15"
              height="15"
              style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "6px" }}
            />
            Zero markup, always: the studio charges nothing between you and the platform — your key,
            your costs, per generation.
          </div>
        </div>
      </div>
    </div>
  );
}
