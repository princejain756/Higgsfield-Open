"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Icon } from "@iconify/react";

import type { RunRecord } from "./history";
import { ArrowRightIcon, CloseIcon, DownloadIcon, PlayIcon } from "./icons";

/* Clips first, and in the order they were picked. A still is not a clip, but it
   is still a beat in the sequence, so it holds the screen for a fixed count
   instead of being dropped — the preview has to match the export. */

const STILL_HOLD_MS = 3000;

export function SequencePlayer({
  records,
  onExport,
  onClose,
}: {
  records: RunRecord[];
  /** Receives the player's own order, which reordering here does not write
      back to the grid's selection. */
  onExport: (ordered: RunRecord[]) => void;
  onClose: () => void;
}) {
  const [order, setOrder] = useState<RunRecord[]>(records);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [skips, setSkips] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const total = order.length;
  const current = order[index];

  const step = useCallback(
    (delta: number) => {
      setIndex((prev) => Math.min(total - 1, Math.max(0, prev + delta)));
    },
    [total],
  );

  const advance = useCallback(() => {
    setIndex((prev) => (prev + 1 >= total ? prev : prev + 1));
  }, [total]);

  /* A still is a timed beat, not a freeze: it advances itself so the preview
     runs start to finish without a press per image. Videos advance from their
     own ended event. */
  useEffect(() => {
    if (!current || current.kind !== "image" || !playing) return;
    const timer = window.setTimeout(advance, STILL_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [current, playing, advance]);

  /* Restarting playback when the beat or the play state changes — and pausing
     the element when it does not, so the toggle means something. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) void video.play().catch(() => undefined);
    else video.pause();
  }, [playing, index, current]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === " ") {
        event.preventDefault();
        setPlaying((prev) => !prev);
        return;
      }
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, step]);

  /* Reorder swaps two neighbours and keeps the moved beat in front of the eye,
     so pressing right twice walks one clip to the end without losing it. */
  function move(delta: number) {
    const to = index + delta;
    if (to < 0 || to >= total) return;
    setOrder((prev) => {
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      if (moved) next.splice(to, 0, moved);
      return next;
    });
    setIndex(to);
  }

  const playable = useMemo(
    () => order.filter((record) => record.status === "completed" && record.urls[0]).length,
    [order],
  );

  const src = current?.urls[0];

  return (
    <div className="ohf-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Sequence preview">
      <div className="ohf-seq-panel" onClick={(event) => event.stopPropagation()}>
        <div className="ohf-seq-head">
          <div>
            <h2 className="ohf-seq-title">Sequence preview</h2>
            <p className="ohf-seq-sub">
              {total} beat{total === 1 ? "" : "s"} · {playable} with media
              {skips > 0 ? ` · ${skips} skipped` : ""}
            </p>
          </div>
          <button type="button" className="ohf-icon-btn ohf-icon-btn--ghost" onClick={onClose} aria-label="Close preview">
            <CloseIcon size={14} />
          </button>
        </div>

        <div className="ohf-seq-stage">
          {src ? (
            current?.kind === "video" ? (
              <video
                ref={videoRef}
                key={current.id}
                className="ohf-seq-media"
                src={src}
                playsInline
                onEnded={advance}
                onError={() => {
                  setSkips((prev) => prev + 1);
                  advance();
                }}
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={current?.id} className="ohf-seq-media" src={src} alt="" />
            )
          ) : (
            <div className="ohf-seq-missing">
              <span>This beat has no media — it was skipped on export.</span>
              <button type="button" className="ohf-seq-skip" onClick={advance}>
                Next beat
                <ArrowRightIcon size={12} />
              </button>
            </div>
          )}

          <div className="ohf-seq-hud">
            <button
              type="button"
              className="ohf-seq-btn"
              aria-label={playing ? "Pause" : "Play"}
              onClick={() => setPlaying((prev) => !prev)}
            >
              {playing ? <Icon icon="lucide:pause" width="15" height="15" /> : <PlayIcon size={15} />}
            </button>
            <span className="ohf-seq-counter">
              {index + 1} / {total}
            </span>
            <span className="ohf-seq-hud-gap" />
            <button
              type="button"
              className="ohf-seq-btn"
              aria-label="Move earlier"
              disabled={index === 0}
              onClick={() => move(-1)}
            >
              <Icon icon="lucide:arrow-left" width="15" height="15" />
            </button>
            <button
              type="button"
              className="ohf-seq-btn"
              aria-label="Move later"
              disabled={index >= total - 1}
              onClick={() => move(1)}
            >
              <Icon icon="lucide:arrow-right" width="15" height="15" />
            </button>
          </div>
        </div>

        <ol className="ohf-seq-strip">
          {order.map((record, position) => (
            <li key={record.id}>
              <button
                type="button"
                className="ohf-seq-thumb"
                data-on={position === index || undefined}
                aria-label={`Beat ${position + 1}. ${record.prompt || record.modelLabel}`}
                aria-current={position === index || undefined}
                onClick={() => setIndex(position)}
              >
                {record.art && <span className="ohf-seq-thumb-art" style={{ background: record.art }} aria-hidden />}
                {record.kind === "image" && record.urls[0] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={record.urls[0]} alt="" loading="lazy" />
                ) : null}
                <span className="ohf-seq-thumb-n">{position + 1}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="ohf-seq-foot">
          <span className="ohf-seq-note">
            Export names the files in this order — 01, 02, 03 — so an editor or a shell
            concatenates them without renaming.
          </span>
          <button
            type="button"
            className="ohf-btn-accent"
            disabled={playable === 0}
            onClick={() => {
              onExport(order);
              onClose();
            }}
          >
            <DownloadIcon size={13} />
            Export {total} in order
          </button>
        </div>
      </div>
    </div>
  );
}
