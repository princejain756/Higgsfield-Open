import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { MediaItem } from "../catalog/types";
import { browserStorage } from "./browser-storage";

/* A character is a named set of reference faces. It is not a run and not an
   attachment: it outlives both, so the same identity can be locked across a
   whole sequence of shots without re-picking the same five stills. The store
   follows the media stores exactly — same storage helper, same blob-URL rule —
   because a character's refs are the same kind of thing as an attachment. */

export type Character = {
  id: string;
  name: string;
  refs: MediaItem[];
};

type CharacterState = {
  characters: Character[];
  activeId?: string;
  /** Returns the new id so a caller can select it in the same press. */
  create: (name: string) => string;
  /** Selecting the active character releases it — one control, both directions. */
  select: (id?: string) => void;
  remove: (id: string) => void;
  setRefs: (id: string, refs: MediaItem[]) => void;
};

/* A shelf, not a library: enough named identities to cover a cast, small enough
   that the chip's popover never becomes a directory. */
const MAX_CHARACTERS = 12;

export const useCharacters = create<CharacterState>()(
  persist(
    (set) => ({
      characters: [],
      activeId: undefined,
      create: (name) => {
        const id = crypto.randomUUID();
        set((state) => ({
          characters: [
            ...state.characters,
            { id, name: name.trim() || "Untitled character", refs: [] },
          ].slice(-MAX_CHARACTERS),
          activeId: id,
        }));
        return id;
      },
      select: (id) =>
        set((state) => ({ activeId: state.activeId === id ? undefined : id })),
      remove: (id) =>
        set((state) => ({
          characters: state.characters.filter((character) => character.id !== id),
          activeId: state.activeId === id ? undefined : state.activeId,
        })),
      setRefs: (id, refs) =>
        set((state) => ({
          characters: state.characters.map((character) =>
            character.id === id ? { ...character, refs } : character,
          ),
        })),
    }),
    {
      name: "openhiggsfield.character.v1",
      storage: browserStorage(),
      /* A blob: URL is revoked when the tab closes, so a persisted one would
         reload as a broken 1×1. The media stores drop them for the same reason;
         the file is still on the uploads shelf to be re-picked. */
      partialize: (state) => ({
        characters: state.characters.map((character) => ({
          ...character,
          refs: character.refs.filter((ref) => !ref.url.startsWith("blob:")),
        })),
        activeId: state.activeId,
      }),
    },
  ),
);

export function activeCharacterOf(state: CharacterState): Character | undefined {
  return state.characters.find((character) => character.id === state.activeId);
}
