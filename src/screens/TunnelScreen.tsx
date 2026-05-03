"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { CrisisResponse } from "@/types";

interface TunnelScreenProps {
  crisis: CrisisResponse;
  stressLevel: string;
  onDone: () => void;
}

/* ─── tiny SVG icons ─────────────────────────────────────────────────────── */
const Icon = {
  Phone: ({ className }: { className?: string }) => (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.5 11.5 0 0 0 3.6.6 1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C10.56 22 2 13.44 2 3a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.6 3.6a1 1 0 0 1-.25 1L6.6 10.8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Arrow: ({ className }: { className?: string }) => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Check: ({ className }: { className?: string }) => (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M3 8l4 4 6-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  External: ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M7 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1V9M10 2h4v4M14 2L7 9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Mic: ({ active, size = 14 }: { active: boolean; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect
        x="9"
        y="2"
        width="6"
        height="11"
        rx="3"
        stroke={active ? "#a78bfa" : "currentColor"}
        strokeWidth="1.5"
      />
      <path
        d="M5 10a7 7 0 0 0 14 0M12 19v3M9 22h6"
        stroke={active ? "#a78bfa" : "currentColor"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  X: () => (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 3l10 10M13 3L3 13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  Globe: ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2.5C12 2.5 8 7 8 12s4 9.5 4 9.5M12 2.5C12 2.5 16 7 16 12s-4 9.5-4 9.5M2.5 12h19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Warn: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Search: ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M21 21l-4.35-4.35"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  Shield: ({ size = 13 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5 4.5-1.35 8-6.25 8-11.5V6l-8-4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Spinner: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.2"
      />
      <path
        d="M3 12a9 9 0 0 1 9-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
};

/* ─── Step dot ───────────────────────────────────────────────────────────── */
function StepDot({
  index,
  current,
  completed,
  total,
}: {
  index: number;
  current: number;
  completed: number[];
  total: number;
}) {
  const isDone = completed.includes(index);
  const isActive = index === current;
  return (
    <div className="flex items-center gap-1.5 flex-1 min-w-0">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-semibold border transition-all duration-300
        ${isDone ? "bg-emerald-600 border-emerald-400 text-white" : isActive ? "bg-violet-600 border-violet-400 text-white scale-110" : "bg-white/4 border-white/10 text-white/30"}`}
      >
        {isDone ? <Icon.Check className="text-white" /> : index + 1}
      </div>
      {index < total - 1 && (
        <div
          className="flex-1 h-px rounded-full transition-all duration-700"
          style={{
            background: isDone
              ? "rgba(52,211,153,0.45)"
              : "rgba(255,255,255,0.08)",
          }}
        />
      )}
    </div>
  );
}

/* ─── Toast ──────────────────────────────────────────────────────────────── */
function Toast({ text, visible }: { text: string; visible: boolean }) {
  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl border border-violet-500/25 bg-[#0c0a1f]/95 backdrop-blur-xl text-violet-200 text-[12.5px] flex items-center gap-2.5 whitespace-nowrap shadow-xl transition-all duration-300
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shrink-0" />
      {text}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   OPEN LINK DIALOG  — shown before navigating; includes voice toggle
═══════════════════════════════════════════════════════════════════════════ */
interface OpenLinkDialogProps {
  url: string;
  label: string;
  hostname: string;
  onOpen: (useVoice: boolean) => void;
  onCancel: () => void;
}

function OpenLinkDialog({
  url,
  label,
  hostname,
  onOpen,
  onCancel,
}: OpenLinkDialogProps) {
  const [useVoice, setUseVoice] = useState(true);

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center px-4 pb-5 sm:pb-0"
      style={{ background: "rgba(5,4,18,0.85)", backdropFilter: "blur(14px)" }}
    >
      {/* sheet */}
      <div
        className="w-full max-w-[360px] rounded-[28px] overflow-hidden"
        style={{
          background:
            "linear-gradient(170deg, #1b1140 0%, #130d35 60%, #0f0a28 100%)",
          border: "1px solid rgba(139,92,246,0.25)",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.4), 0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* top colour bar */}
        <div
          className="h-[3px]"
          style={{
            background: "linear-gradient(90deg,#7c3aed,#6366f1,#06b6d4)",
          }}
        />

        {/* hero */}
        <div className="flex flex-col items-center px-6 pt-8 pb-5 gap-4">
          {/* icon cluster */}
          <div className="relative">
            <div
              className="w-[62px] h-[62px] rounded-[20px] flex items-center justify-center"
              style={{
                background: "rgba(124,58,237,0.15)",
                border: "1px solid rgba(139,92,246,0.3)",
              }}
            >
              <div className="text-violet-300">
                <Icon.Globe size={26} />
              </div>
            </div>
            {/* shield badge */}
            <div
              className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
              style={{
                background: "#0f172a",
                border: "1.5px solid rgba(52,211,153,0.5)",
              }}
            >
              <div className="text-emerald-400">
                <Icon.Shield size={11} />
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[18px] font-semibold text-white/95 tracking-tight">
              Open resource
            </p>
            <p className="text-[12.5px] text-white/35 mt-1 leading-snug">
              You're about to visit an external site
            </p>
          </div>
        </div>

        {/* url pill */}
        <div className="mx-5 mb-4">
          <div
            className="flex items-center gap-3 px-3.5 py-3 rounded-[16px]"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-violet-400"
              style={{
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              <Icon.External size={13} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-white/75 truncate">
                {label}
              </p>
              <p className="text-[11px] text-white/25 font-mono truncate">
                {hostname}
              </p>
            </div>
          </div>
        </div>

        {/* divider */}
        <div
          className="mx-5 mb-4 h-px"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />

        {/* voice toggle */}
        <div className="mx-5 mb-5">
          <p className="text-[10px] uppercase tracking-widest text-white/20 font-semibold mb-2.5 px-0.5">
            Options
          </p>
          <button
            onClick={() => setUseVoice((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-[16px] transition-all duration-200 active:scale-[.99]"
            style={{
              background: useVoice
                ? "rgba(109,40,217,0.14)"
                : "rgba(255,255,255,0.03)",
              border: useVoice
                ? "1px solid rgba(139,92,246,0.32)"
                : "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-3">
              {/* mic icon box */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: useVoice
                    ? "rgba(124,58,237,0.22)"
                    : "rgba(255,255,255,0.05)",
                  border: useVoice
                    ? "1px solid rgba(167,139,250,0.35)"
                    : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <Icon.Mic active={useVoice} size={15} />
              </div>
              <div className="text-left">
                <p
                  className={`text-[12.5px] font-medium transition-colors ${useVoice ? "text-violet-200" : "text-white/35"}`}
                >
                  Voice confirmation
                </p>
                <p className="text-[11px] text-white/22 mt-0.5">
                  Claude speaks when link opens
                </p>
              </div>
            </div>
            {/* pill toggle */}
            <div className="shrink-0" style={{ width: 38, height: 21 }}>
              <div
                className="relative w-full h-full rounded-full transition-all duration-250"
                style={{
                  background: useVoice
                    ? "rgba(124,58,237,0.75)"
                    : "rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="absolute top-[3px] w-[15px] h-[15px] rounded-full transition-all duration-250 shadow"
                  style={{
                    left: useVoice ? "calc(100% - 18px)" : "3px",
                    background: useVoice ? "#ddd6fe" : "rgba(255,255,255,0.3)",
                  }}
                />
              </div>
            </div>
          </button>
        </div>

        {/* CTA buttons */}
        <div className="px-5 pb-7 flex flex-col gap-2.5">
          <button
            onClick={() => onOpen(useVoice)}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-[16px] text-[14px] font-semibold transition-all duration-150 active:scale-[.98]"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#6366f1)",
              border: "1px solid rgba(167,139,250,0.3)",
              color: "#f5f3ff",
              boxShadow: "0 6px 24px rgba(109,40,217,0.35)",
            }}
          >
            <Icon.External size={14} />
            Open link
            <Icon.Arrow className="text-violet-300/70" />
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 rounded-[14px] text-[13px] font-medium text-white/30 hover:text-white/50 transition-all"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Stay on this step
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INVALID LINK DIALOG — shown when URL fails validation
═══════════════════════════════════════════════════════════════════════════ */
interface InvalidLinkDialogProps {
  url: string;
  label: string;
  stepAction: string;
  onClose: () => void;
}

function InvalidLinkDialog({
  url,
  label,
  stepAction,
  onClose,
}: InvalidLinkDialogProps) {
  const hostname = safeHostname(url);

  /* Smart fallback generation */
  const fallbacks = buildFallbacks(url, label, stepAction);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center px-4 pb-5 sm:pb-0"
      style={{ background: "rgba(5,4,18,0.88)", backdropFilter: "blur(14px)" }}
    >
      <div
        className="w-full max-w-[360px] rounded-[28px] overflow-hidden"
        style={{
          background:
            "linear-gradient(170deg,#1f0f08 0%,#160a06 60%,#0e0704 100%)",
          border: "1px solid rgba(251,146,60,0.2)",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.5), 0 40px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* top bar */}
        <div
          className="h-[3px]"
          style={{
            background: "linear-gradient(90deg,#dc2626,#ea580c,#f59e0b)",
          }}
        />

        {/* header row */}
        <div className="flex items-start justify-between px-5 pt-6 pb-4">
          <div className="flex items-start gap-3">
            <div
              className="w-11 h-11 rounded-[16px] flex items-center justify-center shrink-0"
              style={{
                background: "rgba(234,88,12,0.14)",
                border: "1px solid rgba(251,146,60,0.28)",
              }}
            >
              <div className="text-orange-400">
                <Icon.Warn size={18} />
              </div>
            </div>
            <div className="pt-0.5">
              <p className="text-[15px] font-semibold text-white/90 tracking-tight">
                Link unavailable
              </p>
              <p className="text-[11px] text-white/28 mt-0.5 font-mono truncate max-w-[175px]">
                {hostname}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/30 hover:text-white/55 transition-all mt-0.5"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Icon.X />
          </button>
        </div>

        <div className="px-5 pb-6">
          <p className="text-[12.5px] text-white/38 leading-relaxed mb-4">
            This link couldn't be reached — it may be down, incorrect, or
            region-restricted. Here are some alternatives that should work:
          </p>

          {/* fallback list */}
          <div className="flex flex-col gap-2 mb-4">
            {fallbacks.map((fb) => (
              <a
                key={fb.url}
                href={fb.url}
                target="_blank"
                rel="noreferrer"
                onClick={onClose}
                className="group flex items-center justify-between gap-3 px-3.5 py-3 rounded-[14px] transition-all duration-150 hover:scale-[1.01] active:scale-[.99]"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-violet-400 transition-colors group-hover:text-violet-300"
                    style={{
                      background: "rgba(109,40,217,0.13)",
                      border: "1px solid rgba(109,40,217,0.2)",
                    }}
                  >
                    {fb.isSearch ? (
                      <Icon.Search size={13} />
                    ) : (
                      <Icon.External size={13} />
                    )}
                  </div>
                  <div>
                    <p className="text-[12.5px] font-medium text-white/70 group-hover:text-white/90 transition-colors">
                      {fb.name}
                    </p>
                    <p className="text-[11px] text-white/28">{fb.desc}</p>
                  </div>
                </div>
                <Icon.Arrow className="text-white/20 group-hover:text-violet-400 transition-colors shrink-0" />
              </a>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-[12px] text-[12.5px] text-white/28 hover:text-white/48 transition-all"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            Dismiss — continue with steps
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── helpers ────────────────────────────────────────────────────────────── */
function safeHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

interface Fallback {
  name: string;
  url: string;
  desc: string;
  isSearch?: boolean;
}

function buildFallbacks(
  url: string,
  label: string,
  stepAction: string,
): Fallback[] {
  const ctx = `${url} ${label} ${stepAction}`.toLowerCase();
  const results: Fallback[] = [];

  if (/job|employ|work|career|hiring/.test(ctx)) {
    results.push({
      name: "Naukri",
      url: "https://www.naukri.com",
      desc: "Jobs in India",
    });
    results.push({
      name: "LinkedIn Jobs",
      url: "https://www.linkedin.com/jobs",
      desc: "Professional network",
    });
    results.push({
      name: "Indeed India",
      url: "https://in.indeed.com",
      desc: "Millions of listings",
    });
  }
  if (/mental|health|anxiety|therapy|counsel|stress|suicide/.test(ctx)) {
    results.push({
      name: "iCall India",
      url: "https://icallhelpline.org",
      desc: "Free mental health support",
    });
    results.push({
      name: "Vandrevala Foundation",
      url: "https://www.vandrevalafoundation.com",
      desc: "24 × 7 helpline",
    });
    results.push({
      name: "iMind",
      url: "https://imind.co.in",
      desc: "Online therapy",
    });
  }
  if (/housing|shelter|homeless|rent|accommodation/.test(ctx)) {
    results.push({
      name: "NHB India",
      url: "https://nhb.org.in",
      desc: "National Housing Bank",
    });
    results.push({
      name: "PMAY Scheme",
      url: "https://pmaymis.gov.in",
      desc: "Govt housing scheme",
    });
  }
  if (/food|hunger|meal|ration/.test(ctx)) {
    results.push({
      name: "Robin Hood Army",
      url: "https://robinhoodarmy.com",
      desc: "Food relief network",
    });
    results.push({
      name: "No Food Waste",
      url: "https://nofoodwaste.org",
      desc: "Free meals",
    });
  }
  if (/legal|lawyer|court|right|bail|fir/.test(ctx)) {
    results.push({
      name: "NALSA",
      url: "https://nalsa.gov.in",
      desc: "Free legal aid",
    });
    results.push({
      name: "Legal Services India",
      url: "https://www.legalservicesindia.com",
      desc: "Legal guidance",
    });
  }
  if (/finance|loan|debt|money|bank|credit/.test(ctx)) {
    results.push({
      name: "RBI Portal",
      url: "https://www.rbi.org.in",
      desc: "Financial guidance",
    });
    results.push({
      name: "Paisabazaar",
      url: "https://www.paisabazaar.com",
      desc: "Loans & credit",
    });
  }

  // Always add: Google search for the label
  const q = encodeURIComponent(`${label || stepAction} official website India`);
  results.push({
    name: "Search on Google",
    url: `https://www.google.com/search?q=${q}`,
    desc: "Find the official page",
    isSearch: true,
  });

  return results.slice(0, 4);
}

/* ─── URL validation — two-stage: format + reachability ─────────────────── */
function isWellFormedUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    return ["http:", "https:"].includes(u.protocol) && u.hostname.includes(".");
  } catch {
    return false;
  }
}

async function isReachable(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const { hostname, protocol } = new URL(url);
    const img = new Image();
    const t = setTimeout(() => resolve(false), 5_000);

    img.onload = () => {
      clearTimeout(t);
      resolve(true);
    };
    img.onerror = () => {
      // favicon 404 still means host resolved; escalate to HEAD
      fetch(url, {
        method: "HEAD",
        mode: "no-cors",
        signal: AbortSignal.timeout(4_000),
      })
        .then(() => {
          clearTimeout(t);
          resolve(true);
        })
        .catch(() => {
          clearTimeout(t);
          resolve(false);
        });
    };
    img.src = `${protocol}//${hostname}/favicon.ico?_=${Date.now()}`;
  });
}

async function validateUrl(url: string): Promise<boolean> {
  if (!isWellFormedUrl(url)) return false;
  return isReachable(url);
}

const BENIGN_TTS = new Set(["interrupted", "canceled", "not-allowed"]);

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN  TunnelScreen
═══════════════════════════════════════════════════════════════════════════ */
export default function TunnelScreen({
  crisis,
  stressLevel,
  onDone,
}: TunnelScreenProps) {
  /* ── state ── */
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [animKey, setAnimKey] = useState(0);
  const [finished, setFinished] = useState(false);
  const [voiceListening, setVoiceListening] = useState(false);
  const [toastText, setToastText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [voiceReply, setVoiceReply] = useState("");
  const [linkChecking, setLinkChecking] = useState(false);

  // dialogs
  const [openDialog, setOpenDialog] = useState<{
    url: string;
    label: string;
    stepAction: string;
    hostname: string;
  } | null>(null);
  const [invalidDialog, setInvalidDialog] = useState<{
    url: string;
    label: string;
    stepAction: string;
  } | null>(null);

  /* ── refs ── */
  const recogRef = useRef<any>(null);
  const silenceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldListenRef = useRef(true);
  const processingRef = useRef(false);
  const stepRef = useRef(0);
  const convoRef = useRef<{ role: "user" | "assistant"; content: string }[]>(
    [],
  );

  const step = crisis.steps[currentStep];
  const isLast = currentStep === crisis.steps.length - 1;
  const isCrit = stressLevel === "critical";
  const total = crisis.steps.length;
  const pct = Math.round(((currentStep + 1) / total) * 100);

  /* ── TTS ── */
  const speak = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    const fire = () => {
      const voices = window.speechSynthesis.getVoices();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.88;
      u.pitch = 1;
      u.volume = 1;
      u.voice =
        voices.find(
          (v) => v.lang.startsWith("en") && v.name.includes("Google"),
        ) ||
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            ["Samantha", "Daniel", "Karen"].some((n) => v.name.includes(n)),
        ) ||
        voices.find((v) => v.lang.startsWith("en")) ||
        voices[0] ||
        null;
      const ka = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(ka);
          return;
        }
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 10_000);
      u.onend = () => clearInterval(ka);
      u.onerror = (e: SpeechSynthesisErrorEvent) => {
        clearInterval(ka);
        if (!BENIGN_TTS.has(e.error)) console.warn("TTS:", e.error);
      };
      window.speechSynthesis.speak(u);
    };
    if (window.speechSynthesis.getVoices().length) fire();
    else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        fire();
      };
    }
  }, []);

  /* ── step speech ── */
  const stepSpeech = (i: number) => {
    const s = crisis.steps[i];
    if (!s) return "";
    const intro =
      i === 0
        ? "Let's begin your first step."
        : `Moving to step ${i + 1} of ${total}.`;
    const dur = s.duration ? ` This takes about ${s.duration}.` : "";
    const cta = s.link
      ? `Say "open link" to open the resource, or "okay" when ready to continue.`
      : `Say "okay" or "next" when ready to continue.`;
    return `${intro} ${s.action}. ${s.detail}.${dur} ${cta}`;
  };

  const toast = (t: string) => {
    setToastText(t);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2800);
  };

  /* ── prompt open link dialog ── */
  const promptLink = (url: string, label: string, stepAction: string) => {
    setOpenDialog({ url, label, stepAction, hostname: safeHostname(url) });
    speak(
      `Ready to open ${safeHostname(url)}. Confirm to open, or toggle voice confirmation off if you prefer silence.`,
    );
  };

  /* ── confirmed open — validate then navigate or show invalid dialog ── */
  const doOpenLink = async (
    url: string,
    label: string,
    stepAction: string,
    useVoice: boolean,
  ) => {
    setOpenDialog(null);
    setLinkChecking(true);
    if (useVoice) {
      toast("Checking link…");
      speak("Checking the link, one moment.");
    } else toast("Checking link…");

    const ok = await validateUrl(url);
    setLinkChecking(false);

    if (ok) {
      if (useVoice) {
        toast("Opening link…");
        speak("Opening the link now.");
      } else toast("Opening link…");
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      if (useVoice)
        speak(
          "That link doesn't seem to be working right now. I've found some alternatives on screen.",
        );
      setInvalidDialog({ url, label, stepAction });
    }
  };

  /* ── voice recognition ── */
  const listen = useCallback(() => {
    if (!shouldListenRef.current || finished) return;
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) return;
    recogRef.current?.abort();
    const r = new SR();
    r.lang = "en-IN";
    r.continuous = true;
    r.interimResults = true;
    r.onstart = () => setVoiceListening(true);
    r.onend = () => {
      setVoiceListening(false);
      if (shouldListenRef.current && !finished && !processingRef.current)
        setTimeout(listen, 300);
    };
    r.onerror = () => setVoiceListening(false);
    r.onresult = (e: any) => {
      if (silenceRef.current) clearTimeout(silenceRef.current);
      const res = e.results[e.results.length - 1];
      if (!res.isFinal) return;
      const text = res[0].transcript.trim();
      silenceRef.current = setTimeout(() => {
        if (!processingRef.current) {
          processingRef.current = true;
          r.abort();
          handleVoice(text);
        }
      }, 500);
    };
    recogRef.current = r;
    try {
      r.start();
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  /* ── advance step ── */
  const goNext = useCallback(() => {
    setCompleted((p) => [...p, currentStep]);
    if (isLast) {
      setFinished(true);
      speak(
        "Well done. You've completed every step of your plan. Be proud of yourself.",
      );
      onDone();
    } else {
      setAnimKey((k) => k + 1);
      setCurrentStep((s) => {
        const n = s + 1;
        stepRef.current = n;
        return n;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isLast, speak, onDone]);

  /* ── intent matchers ── */
  const isNext = (t: string) =>
    /\b(ok|okay|next|done|got it|yes|sure|continue|alright|yep|yeah|proceed|ready|go|move|complete)\b/.test(
      t,
    );
  const isRepeat = (t: string) =>
    /\b(repeat|say again|again|pardon|come again|one more time|replay)\b/.test(
      t,
    );
  const isLink = (t: string) =>
    /\b(open link|open it|apply|click|go to|visit|navigate|launch|link|apply now)\b/.test(
      t,
    );
  const isConfirm = (t: string) =>
    /\b(open|yes|yeah|sure|okay|ok|confirm|go ahead|do it)\b/.test(t);
  const isCancel = (t: string) =>
    /\b(cancel|no|stop|dismiss|back|close|never mind|don.t)\b/.test(t);

  /* ── process voice ── */
  const handleVoice = async (text: string) => {
    const t = text.toLowerCase();
    const active = crisis.steps[stepRef.current];

    // dialog voice shortcuts
    if (openDialog) {
      if (isConfirm(t)) {
        await doOpenLink(
          openDialog.url,
          openDialog.label,
          openDialog.stepAction,
          true,
        );
        processingRef.current = false;
        listen();
        return;
      }
      if (isCancel(t)) {
        setOpenDialog(null);
        speak("Okay, staying on this step.");
        processingRef.current = false;
        listen();
        return;
      }
    }

    if (isRepeat(t)) {
      toast("Repeating step…");
      speak(stepSpeech(stepRef.current));
      setTimeout(() => {
        processingRef.current = false;
        listen();
      }, 800);
      return;
    }
    if (isLink(t) && active?.link) {
      promptLink(active.link, active.linkLabel || "resource", active.action);
      setTimeout(() => {
        processingRef.current = false;
        listen();
      }, 800);
      return;
    }
    if (isNext(t)) {
      toast(`"${text}" — moving on`);
      if (isLast) speak("Great job. Completing your plan now.");
      else {
        const ns = crisis.steps[stepRef.current + 1];
        speak(`Great. Up next: ${ns?.action ?? "the next step"}.`);
      }
      setTimeout(() => {
        processingRef.current = false;
        goNext();
      }, 600);
      return;
    }

    // conversational AI fallback
    toast("Thinking…");
    speak("One moment.");
    convoRef.current = [
      ...convoRef.current.slice(-10),
      { role: "user", content: text },
    ];
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 200,
          system: `You are a calm, knowledgeable assistant helping someone through a crisis. Answer any question warmly and directly.
CONTEXT — Step ${stepRef.current + 1}/${total}: "${active?.action}". Detail: "${active?.detail}".${active?.link ? ` Link on screen; user can say "open link" to open it.` : ""}
RULES: 2-3 spoken sentences max. No markdown. End with: they can say "okay" to continue or ask anything.`,
          messages: convoRef.current,
        }),
      });
      const data = await res.json();
      const reply =
        data.content?.[0]?.text?.trim() ||
        "Take a breath — continue whenever you're ready.";
      convoRef.current.push({ role: "assistant", content: reply });
      setVoiceReply(reply);
      speak(reply);
      toast(reply.slice(0, 55) + (reply.length > 55 ? "…" : ""));
    } catch {
      const fb = "Take a breath — continue whenever you're ready.";
      convoRef.current.push({ role: "assistant", content: fb });
      setVoiceReply(fb);
      speak(fb);
    }
    setTimeout(() => {
      processingRef.current = false;
      listen();
    }, 1400);
  };

  /* ── step-change effect ── */
  useEffect(() => {
    if (!step) return;
    stepRef.current = currentStep;
    setVoiceReply("");
    processingRef.current = false;
    convoRef.current = [];
    setTimeout(() => speak(stepSpeech(currentStep)), 150);
    listen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  /* ── cleanup ── */
  useEffect(() => {
    shouldListenRef.current = true;
    return () => {
      shouldListenRef.current = false;
      recogRef.current?.abort();
      window.speechSynthesis.cancel();
      if (silenceRef.current) clearTimeout(silenceRef.current);
    };
  }, []);

  /* ── done screen ── */
  if (finished)
    return (
      <div className="fixed inset-0 bg-[#08061a] flex flex-col items-center justify-center px-6">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 40%,rgba(16,185,129,0.12) 0%,transparent 70%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-5 text-center max-w-xs">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(52,211,153,0.4)",
            }}
          >
            <Icon.Check className="text-emerald-400 w-7 h-7" />
          </div>
          <div>
            <h2 className="text-[24px] font-semibold text-white/95 tracking-tight mb-2">
              All done
            </h2>
            <p className="text-[13.5px] text-white/30 leading-relaxed">
              You completed every step. Well done for showing up for yourself
              today.
            </p>
          </div>
        </div>
      </div>
    );

  /* ── main ── */
  return (
    <>
      {/* Dialogs */}
      {openDialog && (
        <OpenLinkDialog
          url={openDialog.url}
          label={openDialog.label}
          hostname={openDialog.hostname}
          onOpen={(v) =>
            doOpenLink(
              openDialog.url,
              openDialog.label,
              openDialog.stepAction,
              v,
            )
          }
          onCancel={() => {
            setOpenDialog(null);
            speak("Okay, staying on this step.");
          }}
        />
      )}
      {invalidDialog && (
        <InvalidLinkDialog
          url={invalidDialog.url}
          label={invalidDialog.label}
          stepAction={invalidDialog.stepAction}
          onClose={() => setInvalidDialog(null)}
        />
      )}

      {/* Page */}
      <div
        className={`fixed inset-0 flex flex-col w-full items-center px-5 py-10 overflow-hidden ${isCrit ? "bg-[#180808]" : "bg-[#08061a]"}`}
      >
        {/* ambient blobs */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: 0,
            background: isCrit
              ? "radial-gradient(ellipse 70% 50% at 20% 0%,rgba(185,28,28,0.18) 0%,transparent 60%),radial-gradient(ellipse 50% 40% at 80% 100%,rgba(153,27,27,0.14) 0%,transparent 60%)"
              : "radial-gradient(ellipse 70% 50% at 20% 0%,rgba(109,40,217,0.18) 0%,transparent 60%),radial-gradient(ellipse 50% 40% at 80% 100%,rgba(79,70,229,0.13) 0%,transparent 60%)",
          }}
        />

        <div className="relative z-10 flex flex-col gap-4 w-full max-w-lg mx-auto h-full">
          {/* ── header ── */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10.5px] text-white/25 uppercase tracking-widest mb-1 font-semibold">
                  Your action plan
                </p>
                <h1 className="text-[21px] font-semibold text-white/95 tracking-tight leading-snug">
                  Step-by-step guidance
                </h1>
                <p className="text-[12.5px] text-white/28 mt-0.5">
                  Follow each step calmly and methodically
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold border
                  ${isCrit ? "bg-red-900/20 border-red-500/30 text-red-300" : "bg-violet-900/22 border-violet-500/30 text-violet-300"}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isCrit ? "bg-red-400" : "bg-violet-400 animate-pulse"}`}
                  />
                  {isCrit ? "Critical" : "Urgent"}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] border transition-all duration-300
                  ${voiceListening ? "bg-violet-900/28 border-violet-400/35 text-violet-300" : "bg-white/3 border-white/8 text-white/22"}`}
                >
                  <Icon.Mic active={voiceListening} size={12} />
                  {voiceListening ? "Listening…" : "Voice ready"}
                </span>
              </div>
            </div>

            {/* step dots */}
            <div className="flex items-center">
              {crisis.steps.map((_, i) => (
                <StepDot
                  key={i}
                  index={i}
                  current={currentStep}
                  completed={completed}
                  total={total}
                />
              ))}
            </div>
          </div>

          {/* ── emergency call ── */}
          {crisis.emergencyCall && currentStep === 0 && (
            <a
              href={`tel:${crisis.emergencyCall}`}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-[16px] border border-red-500/30 bg-red-900/15 text-red-200/85 text-[13px] font-medium hover:bg-red-900/25 transition-all"
            >
              <Icon.Phone /> Call {crisis.emergencyCall} now <Icon.Arrow />
            </a>
          )}

          {/* ── step card ── */}
          <div
            key={animKey}
            className="rounded-[22px] relative overflow-hidden"
            style={{
              background: isCrit
                ? "rgba(153,27,27,0.2)"
                : "rgba(109,40,217,0.16)",
              border: "1px solid rgba(139,92,246,0.22)",
              minHeight: 220,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              animation: "fadeSlideUp .28s ease both",
            }}
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full border border-white/4 pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full border border-white/3 pointer-events-none" />

            <div
              className="relative z-10 flex flex-col px-5 pt-5 pb-4 gap-3"
              style={{ minHeight: 220 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] text-white/30 uppercase tracking-widest font-semibold">
                  Step {currentStep + 1} of {total}
                </span>
                {step?.duration && (
                  <span className="text-[11px] text-violet-300/65 bg-violet-900/22 border border-violet-500/22 px-2.5 py-1 rounded-full">
                    {step.duration}
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-3">
                <h2 className="text-[21px] font-semibold text-white/95 leading-snug tracking-tight">
                  {step?.action}
                </h2>
                <p className="text-[13px] text-white/45 leading-relaxed max-w-[290px]">
                  {step?.detail}
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${voiceListening ? "bg-violet-400 animate-pulse" : "bg-white/12"}`}
                />
                <span
                  className={`text-[11px] transition-colors ${voiceListening ? "text-violet-400" : "text-white/18"}`}
                >
                  {voiceListening
                    ? `Say "okay"${step?.link ? `, "open link"` : ""}, or ask anything`
                    : "Waiting…"}
                </span>
              </div>

              {/* progress bar */}
              <div className="h-[3px] rounded-full bg-white/6 overflow-hidden">
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-in-out"
                  style={{
                    width: `${pct}%`,
                    background: isCrit
                      ? "rgba(252,165,165,0.65)"
                      : "rgba(167,139,250,0.65)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* ── AI reply ── */}
          {voiceReply && (
            <div
              className="flex items-start gap-3 px-4 py-3.5 rounded-[16px] border border-violet-500/18 bg-violet-900/8"
              style={{ animation: "fadeSlideUp .28s ease both" }}
            >
              <span className="text-base shrink-0 mt-0.5">🧠</span>
              <p className="text-[12.5px] text-violet-200/75 leading-relaxed">
                {voiceReply}
              </p>
            </div>
          )}

          {/* ── link button ── */}
          {step?.link && (
            <button
              onClick={() =>
                promptLink(
                  step.link!,
                  step.linkLabel || "resource",
                  step.action,
                )
              }
              disabled={linkChecking}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-[16px] border border-sky-500/28 bg-sky-900/12 text-sky-200/80 text-[13px] font-medium hover:bg-sky-900/22 transition-all disabled:opacity-50 disabled:cursor-wait w-full"
            >
              {linkChecking ? (
                <>
                  <Icon.Spinner />
                  <span>Checking link…</span>
                </>
              ) : (
                <>
                  <Icon.External size={13} />
                  {step.linkLabel || "Open service link"}
                  <Icon.Arrow className="text-sky-400/60" />
                  <span className="text-[11px] text-sky-400/45">
                    (or say "open link")
                  </span>
                </>
              )}
            </button>
          )}

          {/* ── next button ── */}
          <button
            onClick={goNext}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-[16px] text-[14px] font-semibold border transition-all duration-150 hover:opacity-90 active:scale-[.98]
              ${isLast ? "bg-emerald-700/65 border-emerald-500/35 text-emerald-100" : "bg-violet-700/60 border-violet-500/35 text-violet-100"}`}
            style={{
              boxShadow: isLast
                ? "0 4px 20px rgba(16,185,129,0.2)"
                : "0 4px 20px rgba(109,40,217,0.25)",
            }}
          >
            {isLast ? (
              <>
                <Icon.Check className="text-emerald-200" />
                Complete the plan
              </>
            ) : (
              <>
                <Icon.Arrow className="text-violet-300" />
                Complete this step
              </>
            )}
          </button>
        </div>

        <Toast text={toastText} visible={toastVisible} />
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
