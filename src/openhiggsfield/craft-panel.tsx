"use client";

import { useState } from "react";

import { Icon } from "@iconify/react";

import type { ModelEntry, Surface } from "@/generation/catalog";
import type { ShotPreset } from "@/generation/shots";

import { appendCraft, groupsFor, surprisePrompt, tipsFor } from "./craft";
import { CheckIcon, UndoIcon } from "./icons";

/* Surprise replaces the whole prompt, so the replaced text is held here until
   the visitor moves on — one press brings their own words back. */
type Stash = { text: string } | null;

export function CraftPanel({
  model,
  promptText,
  onApply,
  shots,
  onApplyShot,
}: {
  model: ModelEntry;
  promptText: string;
  onApply: (next: string) => void;
  /** Face-locked video models get a shot grammar above the free-form tags. */
  shots?: readonly ShotPreset[];
  onApplyShot?: (shot: ShotPreset) => void;
}) {
  const [stash, setStash] = useState<Stash>(null);
  const surface: Surface = model.surface;
  const tips = tipsFor(model);

  const surprise = () => {
    const current = promptText.trim();
    const next = surprisePrompt(surface);
    if (current && current !== next) setStash({ text: promptText });
    onApply(next);
  };

  const insert = (phrase: string) => {
    onApply(appendCraft(promptText, phrase));
  };

  return (
    <div
      className="ohf-popover ohf-popover--craft"
      role="dialog"
      aria-label="Prompt craft"
    >
      <div className="ohf-craft-head">
        <div className="ohf-craft-title">
          <h3 className="ohf-craft-name">Prompt craft</h3>
          <p className="ohf-craft-sub">{model.label}</p>
        </div>
        <button type="button" className="ohf-craft-dice" onClick={surprise}>
          <Icon icon="lucide:dices" width="13" height="13" />
          Surprise me
        </button>
      </div>

      {stash && (
        <button
          type="button"
          className="ohf-craft-restore"
          onClick={() => {
            onApply(stash.text);
            setStash(null);
          }}
        >
          <UndoIcon />
          Restore your last prompt
        </button>
      )}

      <div className="ohf-craft-tips">
        <h4 className="ohf-craft-label">For this model</h4>
        <ul className="ohf-craft-tip-list">
          {tips.map((tip) => (
            <li key={tip} className="ohf-craft-tip">
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {shots && shots.length > 0 && onApplyShot && (
        <section className="ohf-craft-group ohf-craft-group--shots">
          <h4 className="ohf-craft-label">Shot presets</h4>
          <div className="ohf-craft-tags">
            {shots.map((shot) => (
              <button
                key={shot.label}
                type="button"
                className="ohf-craft-tag ohf-craft-tag--shot"
                title={shot.phrase}
                aria-label={`Framed shot: ${shot.label}`}
                onClick={() => onApplyShot(shot)}
              >
                <Icon icon="lucide:clapperboard" width="11" height="11" />
                {shot.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {groupsFor(surface).map((group) => (
        <section key={group.title} className="ohf-craft-group">
          <h4 className="ohf-craft-label">{group.title}</h4>
          <div className="ohf-craft-tags">
            {group.tags.map((tag) => (
              <button
                key={tag.label}
                type="button"
                className="ohf-craft-tag"
                title={tag.insert}
                aria-label={`Insert ${tag.label} into prompt`}
                onClick={() => insert(tag.insert)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </section>
      ))}

      <p className="ohf-craft-foot">
        <CheckIcon size={11} />
        Tags join your prompt with a comma — nothing is overwritten.
      </p>
    </div>
  );
}
