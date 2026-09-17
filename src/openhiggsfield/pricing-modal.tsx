"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { RATES_AS_OF } from "./data";
import { CloseIcon } from "./icons";

interface ComparisonItem {
  feature: string;
  higgsfield: string;
  higgsfieldHighlight?: boolean;
  runway: string;
  luma: string;
  kling: string;
}

const COMPARISON_DATA: ComparisonItem[] = [
  {
    feature: "Flagship Video Model",
    higgsfield: "Seedance 2.5 (ByteDance) & Wan 3.0 Prime",
    higgsfieldHighlight: true,
    runway: "Gen-3 Alpha Turbo",
    luma: "Dream Machine 1.5",
    kling: "Kling 1.5 Pro",
  },
  {
    feature: "Direct Face Inputs (US)",
    higgsfield: "Yes — Seedance 2.5 US Native",
    higgsfieldHighlight: true,
    runway: "No",
    luma: "No",
    kling: "Restricted / Delayed",
  },
  {
    feature: "Price per 5s Video",
    higgsfield: "$0.15 (Wan) – $0.72 (Seedance 2.5)",
    higgsfieldHighlight: true,
    runway: "$0.40 - $0.60",
    luma: "$0.50 - $0.80",
    kling: "$0.35 - $0.50",
  },
  {
    feature: "Price per Image",
    higgsfield: "$0.003 (Soul 2)",
    higgsfieldHighlight: true,
    runway: "$0.04 - $0.08",
    luma: "N/A",
    kling: "$0.03 - $0.05",
  },
  {
    feature: "Models Available in 1 Studio",
    higgsfield: "38 Models (Multi-Provider)",
    higgsfieldHighlight: true,
    runway: "Runway models only",
    luma: "Luma models only",
    kling: "Kling models only",
  },
  {
    feature: "Client Codebase",
    higgsfield: "Open Source (React 19, Next.js 16)",
    higgsfieldHighlight: true,
    runway: "Closed source web app",
    luma: "Closed source web app",
    kling: "Closed source web app",
  },
  {
    feature: "API Access & Platform Keys",
    higgsfield: "Direct key. Pay per request.",
    higgsfieldHighlight: true,
    runway: "Monthly subscription required",
    luma: "Credits expire monthly",
    kling: "Monthly subscription required",
  },
];

export function PricingModal({
  isOpen,
  onClose,
  onConfigureKey,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfigureKey: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="ohf-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="ohf-modal-panel ohf-pricing-panel"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ohf-modal-header">
          <div className="ohf-pricing-headline">
            <span className="ohf-award-badge">
              <Icon icon="lucide:layers" width="13" height="13" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "5px" }} />
              Price comparison
            </span>
            <h2 className="ohf-modal-title">Higgsfield vs Alternatives</h2>
            <p className="ohf-modal-desc">
              Direct API pricing per generation across generative video and image models. Studio
              rates below as of {RATES_AS_OF}.
            </p>
          </div>
          <button
            type="button"
            className="ohf-icon-btn ohf-icon-btn--ghost"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon size={14} />
          </button>
        </div>

        <div className="ohf-pricing-table-wrap">
          <table className="ohf-pricing-table">
            <thead>
              <tr>
                <th>Model / Platform</th>
                <th className="ohf-th-highlight">
                  <div className="ohf-brand-tag">HIGGSFIELD AI</div>
                  <span>Seedance 2.5 + 38 Models</span>
                </th>
                <th>Runway Gen-3</th>
                <th>Luma Dream Machine</th>
                <th>Kling AI</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_DATA.map((row, i) => (
                <tr key={i}>
                  <td className="ohf-td-feat">{row.feature}</td>
                  <td className="ohf-td-highlight">
                    <strong>{row.higgsfield}</strong>
                  </td>
                  <td>{row.runway}</td>
                  <td>{row.luma}</td>
                  <td>{row.kling}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ohf-pricing-footer">
          <div className="ohf-pricing-footnote">
            <Icon icon="lucide:sparkles" width="15" height="15" style={{ display: "inline-block", verticalAlign: "-2px", marginRight: "6px" }} />
            <strong>Seedance 2.5 with direct face inputs</strong> is available through Higgsfield API. No subscription fee — bring your platform key.
          </div>
          <div className="ohf-pricing-actions">
            <a
              href="https://cloud.higgsfield.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="ohf-btn-subtle"
            >
              <span>Get credentials at cloud.higgsfield.ai</span>
              <Icon icon="lucide:arrow-up-right" width="13" height="13" style={{ marginLeft: "5px", verticalAlign: "-2px" }} />
            </a>
            <button
              type="button"
              className="ohf-btn-accent"
              onClick={() => {
                onClose();
                onConfigureKey();
              }}
            >
              Enter API Key in Studio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
