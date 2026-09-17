"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@iconify/react";

import { clearPlatformCredentials, savePlatformCredentials } from "@/generation/actions";
import { CloseIcon } from "./icons";

export function KeyModal({
  configured,
  onClose,
  onSaved,
  onCleared,
}: {
  configured: boolean;
  onClose: () => void;
  onSaved: () => void;
  onCleared: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [keyId, setKeyId] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ref.current?.showModal();
    panelRef.current?.focus();
  }, []);

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const text = event.clipboardData.getData("text").trim();
    const clean = text.replace(/^(key|bearer)\s+/i, "");
    if (clean.includes(":")) {
      event.preventDefault();
      const [first, ...rest] = clean.split(":");
      setKeyId(first.trim());
      setSecretKey(rest.join(":").trim());
      setError(null);
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const cleanId = keyId.trim();
    const cleanSecret = secretKey.trim();

    if (!cleanId || !cleanSecret) {
      setError("Enter both your Key ID and Secret Key.");
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const result = await savePlatformCredentials({ keyId: cleanId, secretKey: cleanSecret });
      if (!result.ok) {
        setError(result.error ?? "Invalid credentials. Please check your Key ID and Secret Key.");
        return;
      }
      onSaved();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save credentials. Check your connection.");
    } finally {
      setBusy(false);
    }
  }

  async function onClear() {
    setBusy(true);
    setError(null);
    try {
      await clearPlatformCredentials();
      setKeyId("");
      setSecretKey("");
      onCleared();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not remove credentials");
    } finally {
      setBusy(false);
    }
  }

  const canSave = keyId.trim().length > 0 && secretKey.trim().length > 0;

  return (
    <dialog
      ref={ref}
      aria-labelledby="ohf-keys-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div ref={panelRef} tabIndex={-1} className="ohf-dialog-panel ohf-keys-panel">
        <div className="ohf-keys-head">
          <div>
            <div id="ohf-keys-title" className="ohf-keys-title">
              API Credentials
            </div>
            <p className="ohf-keys-copy">
              Your credentials are saved in a private httpOnly cookie in this browser and sent directly to the Higgsfield API.
            </p>
            <p className="ohf-keys-copy" style={{ marginTop: "6px" }}>
              <a
                href="https://cloud.higgsfield.ai"
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--accent)", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <span>Get your Key ID and Secret Key at cloud.higgsfield.ai</span>
                <Icon icon="lucide:arrow-up-right" width="12" height="12" />
              </a>
            </p>
          </div>
          <button type="button" className="ohf-icon-btn" aria-label="Close" onClick={onClose}>
            <CloseIcon size={13} />
          </button>
        </div>

        <form className="ohf-keys-form" onSubmit={(event) => void onSubmit(event)}>
          <label className="ohf-field">
            <div className="ohf-field-label">Key ID</div>
            <input
              className="ohf-input ohf-input--mono"
              name="key_id"
              type="text"
              placeholder="Paste Key ID (or paste combined id:secret here)"
              autoComplete="off"
              spellCheck={false}
              value={keyId}
              onPaste={handlePaste}
              onChange={(event) => {
                setError(null);
                setKeyId(event.target.value);
              }}
            />
          </label>

          <label className="ohf-field" style={{ marginTop: "10px" }}>
            <div className="ohf-field-label">Secret Key</div>
            <input
              className="ohf-input ohf-input--mono"
              name="secret_key"
              type="password"
              placeholder="Paste Secret Key"
              autoComplete="off"
              spellCheck={false}
              value={secretKey}
              onPaste={handlePaste}
              onChange={(event) => {
                setError(null);
                setSecretKey(event.target.value);
              }}
            />
          </label>

          {error && (
            <div className="ohf-alert" role="alert" style={{ marginTop: "12px" }}>
              <span className="ohf-alert-text">{error}</span>
            </div>
          )}

          <div className="ohf-keys-actions" style={{ marginTop: "16px" }}>
            {configured && (
              <button type="button" className="ohf-btn-quiet" disabled={busy} onClick={() => void onClear()}>
                Remove credentials
              </button>
            )}
            <button type="submit" className="ohf-keys-save" disabled={busy || !canSave}>
              {busy ? "Saving…" : configured ? "Update credentials" : "Save credentials"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}