"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Icon } from "@iconify/react";

import type { MediaItem, ModelEntry } from "@/generation/catalog";
import { useCharacters } from "@/generation/stores/character";

import type { RunRecord } from "./history";
import { CheckIcon, PlusIcon, TrashIcon, UploadIcon } from "./icons";
import type { UploadRecord } from "./uploads";

/* The face-lock shelf. A character is named once and then reused, so the panel
   is a roster on top and a contact sheet under it — the roster survives reloads,
   the stills are whatever this browser has uploaded or generated. */

type Candidate = { url: string; title: string; art?: string };

export function CharacterPanel({
  model,
  uploads,
  history,
  staged,
  uploading,
  onUpload,
  onClose,
}: {
  model: ModelEntry;
  uploads: UploadRecord[];
  history: RunRecord[];
  /** A URL the tray just put in Blob. It belongs to the character being
      edited, not to the plane — the panel's whole job is filling this shelf. */
  staged: string | null;
  uploading: boolean;
  onUpload: () => void;
  onClose: () => void;
}) {
  const characters = useCharacters((state) => state.characters);
  const activeId = useCharacters((state) => state.activeId);
  const create = useCharacters((state) => state.create);
  const select = useCharacters((state) => state.select);
  const remove = useCharacters((state) => state.remove);
  const setRefs = useCharacters((state) => state.setRefs);

  const cap = model.roles.reference ?? 0;
  const active = characters.find((character) => character.id === activeId);
  const picked = active ? active.refs.map((ref) => ref.url) : [];
  const [name, setName] = useState("");

  /* Files first, then finished stills — the same two shelves the asset picker
     offers, cut down to the one kind a face reference can be. */
  const candidates = useMemo<Candidate[]>(() => {
    const out: Candidate[] = [];
    const seen = new Set<string>();
    for (const record of uploads) {
      if (record.kind !== "image" || seen.has(record.url)) continue;
      seen.add(record.url);
      out.push({ url: record.url, title: record.name });
    }
    for (const record of history) {
      if (record.status !== "completed" || record.kind !== "image") continue;
      for (const url of record.urls) {
        if (seen.has(url)) continue;
        seen.add(url);
        out.push({ url, title: record.prompt, art: record.art });
      }
    }
    return out;
  }, [uploads, history]);

  const lastStaged = useRef<string | null>(null);
  useEffect(() => {
    if (!active || !staged || staged === lastStaged.current) return;
    lastStaged.current = staged;
    if (picked.includes(staged) || picked.length >= cap) return;
    const ref: MediaItem = { id: crypto.randomUUID(), url: staged, role: "reference" };
    setRefs(active.id, [...active.refs, ref]);
  }, [active, staged, picked, cap, setRefs]);

  function toggle(candidate: Candidate) {
    if (!active) return;
    if (picked.includes(candidate.url)) {
      setRefs(
        active.id,
        active.refs.filter((ref) => ref.url !== candidate.url),
      );
      return;
    }
    if (picked.length >= cap) return;
    const ref: MediaItem = { id: crypto.randomUUID(), url: candidate.url, role: "reference" };
    setRefs(active.id, [...active.refs, ref]);
  }

  function add() {
    create(name);
    setName("");
  }

  return (
    <div
      className="ohf-popover ohf-popover--character"
      role="dialog"
      aria-label="Characters"
    >
      <div className="ohf-char-head">
        <div className="ohf-char-heading">
          <h3 className="ohf-char-title">Characters</h3>
          <p className="ohf-char-sub">
            Lock one face across shots — up to {cap} reference stills, kept on this device.
          </p>
        </div>
        <button
          type="button"
          className="ohf-picker-close"
          aria-label="Close characters"
          onClick={onClose}
        >
          <Icon icon="lucide:x" width="14" height="14" />
        </button>
      </div>

      {characters.length > 0 && (
        <ul className="ohf-char-list">
          {characters.map((character) => {
            const on = character.id === activeId;
            return (
              <li key={character.id} className="ohf-char-item" data-on={on || undefined}>
                <button
                  type="button"
                  className="ohf-char-pick"
                  aria-pressed={on}
                  onClick={() => select(character.id)}
                >
                  <span className="ohf-char-mark" aria-hidden>
                    {on && <CheckIcon size={11} />}
                  </span>
                  <span className="ohf-char-name">{character.name}</span>
                  <span className="ohf-char-count">
                    {character.refs.length}/{cap}
                  </span>
                </button>
                <button
                  type="button"
                  className="ohf-char-del"
                  aria-label={`Delete ${character.name}`}
                  title={`Delete ${character.name}`}
                  onClick={() => remove(character.id)}
                >
                  <TrashIcon size={12} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="ohf-char-new">
        <input
          className="ohf-char-input"
          value={name}
          placeholder="New character name"
          aria-label="New character name"
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
        />
        <button type="button" className="ohf-char-add" onClick={add}>
          <PlusIcon size={12} />
          Add
        </button>
      </div>

      {active ? (
        <div className="ohf-char-refs">
          <div className="ohf-char-refs-head">
            <span className="ohf-char-label">Reference stills</span>
            <span className="ohf-char-tally">
              {picked.length} of {cap}
            </span>
          </div>
          <div className="ohf-assets-grid">
            <button
              type="button"
              className="ohf-asset ohf-asset--upload"
              disabled={uploading || picked.length >= cap}
              onClick={onUpload}
            >
              {uploading ? (
                <span className="ohf-spinner" aria-hidden />
              ) : (
                <UploadIcon size={16} />
              )}
              <span className="ohf-asset-upload-label">
                {uploading ? "Uploading" : "Upload"}
              </span>
            </button>
            {candidates.map((candidate) => {
              const on = picked.includes(candidate.url);
              return (
                <button
                  key={candidate.url}
                  type="button"
                  className="ohf-asset"
                  data-picked={on || undefined}
                  title={candidate.title}
                  aria-pressed={on}
                  aria-label={candidate.title}
                  onClick={() => toggle(candidate)}
                >
                  <span
                    className="ohf-asset-art"
                    style={candidate.art ? { background: candidate.art } : undefined}
                    aria-hidden
                  />
                  {/* Blob and platform CDN hosts both; next/image would need
                      every remote host allow-listed for no gain on a thumbnail. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="ohf-asset-media"
                    src={candidate.url}
                    alt=""
                    loading="lazy"
                  />
                  <span className="ohf-asset-mark" aria-hidden>
                    <CheckIcon size={11} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="ohf-char-empty">
          Name a character to start locking a face across shots.
        </p>
      )}
    </div>
  );
}
