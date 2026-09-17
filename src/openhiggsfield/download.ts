import type { RunRecord } from "./history";

/* Result media is served from the platform's own CDN, so an <a download>
   pointed at it is ignored — the attribute only names a file when the href is
   same-origin. The bytes have to be read first, which means the CDN's CORS
   policy decides whether a run can be saved at all. A refusal is reported
   rather than papered over with a new tab the popup blocker would eat. */
export async function saveFile(url: string, name: string): Promise<boolean> {
  try {
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) return false;
    const href = URL.createObjectURL(await response.blob());
    const link = document.createElement("a");
    link.href = href;
    link.download = name;
    link.click();
    /* Revoking on the next tick races Safari, which reads the blob after the
       click returns. The handle costs nothing until then. */
    setTimeout(() => URL.revokeObjectURL(href), 60_000);
    return true;
  } catch {
    return false;
  }
}

/** A saved run has to be findable in a downloads folder six months later, so
    the name carries the prompt rather than the platform's request id. */
function slugOf(record: RunRecord): string {
  return (
    record.prompt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 44)
      .replace(/-+$/, "") || "run"
  );
}

function extOf(record: RunRecord): string {
  const url = record.urls[0] ?? "";
  const ext = /\.([a-z0-9]{2,4})(?:[?#]|$)/i.exec(url)?.[1]?.toLowerCase();
  return ext ?? (record.kind === "video" ? "mp4" : "png");
}

export function fileNameFor(record: RunRecord, index: number): string {
  return `openhiggsfield-${slugOf(record)}-${index + 1}.${extOf(record)}`;
}

/* A sequence is ordered, so its names have to be too. Two digits sort correctly
   in every file browser and every ffmpeg concat list up to 99 beats; a third
   digit simply beats a two-digit name and keeps the run together. */
export function sequenceFileName(record: RunRecord, index: number): string {
  return `${String(index + 1).padStart(2, "0")}-${slugOf(record)}.${extOf(record)}`;
}
