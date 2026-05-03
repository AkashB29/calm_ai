"use client";
import { useEffect, useRef, useState } from "react";

interface Phase {
  at: number;
  label: string;
  msg2: string;
  msg3: string;
  p3: number;
  card2done?: boolean;
  card3active?: boolean;
  card3done?: boolean;
}

const PHASES: Phase[] = [
  {
    at: 20,
    label: "Reading context…",
    msg2: "Parsing signals…",
    msg3: "Waiting…",
    p3: 28,
  },
  {
    at: 45,
    label: "Analyzing patterns…",
    msg2: "Identifying triggers…",
    msg3: "Standing by…",
    p3: 38,
  },
  {
    at: 68,
    label: "Building response…",
    msg2: "Analysis complete",
    msg3: "Drafting steps…",
    p3: 62,
    card2done: true,
  },
  {
    at: 88,
    label: "Finalizing plan…",
    msg2: "Analysis complete",
    msg3: "Refining steps…",
    p3: 85,
    card2done: true,
    card3active: true,
  },
  {
    at: 97,
    label: "Almost ready…",
    msg2: "Analysis complete",
    msg3: "Ready",
    p3: 100,
    card2done: true,
    card3done: true,
  },
];

/* ── small icon components ── */
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5" stroke="#34d399" strokeWidth="1.2" />
      <path
        d="M6 8l1.5 1.5L10.5 6"
        stroke="#34d399"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2z"
        stroke="#818cf8"
        strokeWidth="1.2"
      />
      <path
        d="M8 5v3l2 2"
        stroke="#818cf8"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="4" width="10" height="1.5" rx=".75" fill="#a78bfa" />
      <rect x="3" y="7.25" width="7" height="1.5" rx=".75" fill="#a78bfa" />
      <rect x="3" y="10.5" width="8.5" height="1.5" rx=".75" fill="#a78bfa" />
    </svg>
  );
}
function BrainIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      className="animate-pulse"
    >
      <path
        d="M9.5 2a4.5 4.5 0 0 1 4.5 4.5V7h.5a3 3 0 0 1 3 3v.5a3.5 3.5 0 0 1 0 7H14v.5a4.5 4.5 0 0 1-9 0V17H4.5a3.5 3.5 0 0 1 0-7H5v-.5a3 3 0 0 1 3-3h.5v-.5A4.5 4.5 0 0 1 9.5 2Z"
        stroke="#a78bfa"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── status badge ── */
type BadgeState = "queued" | "active" | "done";
function Badge({ state }: { state: BadgeState }) {
  const styles: Record<BadgeState, string> = {
    queued: "text-purple-300/70  bg-purple-900/20 border-purple-500/22",
    active: "text-indigo-300/85  bg-indigo-900/18 border-indigo-500/28",
    done: "text-emerald-300/80 bg-emerald-900/15 border-emerald-500/25",
  };
  const labels: Record<BadgeState, string> = {
    queued: "Queued",
    active: "Active",
    done: "Done",
  };
  return (
    <span
      className={`text-[11px] px-2 py-0.5 rounded-full border ${styles[state]}`}
    >
      {labels[state]}
    </span>
  );
}

/* ── status card ── */
interface StatusCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  barColor: string;
  barWidth: number;
  badge: BadgeState;
  delay?: string;
}
function StatusCard({
  icon,
  iconBg,
  label,
  value,
  barColor,
  barWidth,
  badge,
  delay = "0s",
}: StatusCardProps) {
  return (
    <div
      className="flex flex-col gap-2.5 rounded-2xl p-4 border border-white/10 bg-white/3 animate-[fadeSlideUp_.5s_ease_both]"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
        <Badge state={badge} />
      </div>
      <div>
        <p className="text-[11px] text-white/40 tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-[13px] font-medium text-white/80">{value}</p>
      </div>
      <div className="h-0.75 rounded-full bg-white/8 overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-1000 ease-in-out"
          style={{ width: `${barWidth}%`, background: barColor }}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   Main component
══════════════════════════════════════ */
export default function ThinkingScreen() {
  const [pct, setPct] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [bar2w, setBar2w] = useState(70);
  const [bar3w, setBar3w] = useState(28);
  const [card2Val, setCard2Val] = useState("Processing…");
  const [card3Val, setCard3Val] = useState("Waiting…");
  const [card2Badge, setCard2Badge] = useState<BadgeState>("active");
  const [card3Badge, setCard3Badge] = useState<BadgeState>("queued");
  const [progressLabel, setProgressLabel] = useState("Processing...");
  const [subMsg, setSubMsg] = useState(
    "Understanding your stress signals and crafting a response plan.",
  );
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseIdxRef = useRef(0);
  const pctRef = useRef(0);

  useEffect(() => {
    tickRef.current = setInterval(() => {
      pctRef.current = Math.min(
        97,
        pctRef.current + (Math.random() * 2.5 + 0.8),
      );
      const rounded = Math.round(pctRef.current);
      setPct(rounded);

      const ph = PHASES.find(
        (p, i) => rounded >= p.at && phaseIdxRef.current <= i,
      );
      if (ph) {
        const idx = PHASES.indexOf(ph);
        phaseIdxRef.current = idx + 1;
        setPhaseIdx(idx + 1);
        setProgressLabel(ph.label);
        setBar2w(85);
        setBar3w(ph.p3);
        setCard2Val(ph.msg2);
        setCard3Val(ph.msg3);
        if (ph.card2done) setCard2Badge("done");
        if (ph.card3active) setCard3Badge("active");
        if (ph.card3done) {
          setCard3Badge("done");
          setSubMsg("Your plan is ready. Handing off now.");
        }
      }
    }, 420);

    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#08061a] flex flex-col items-center justify-between px-6 py-12 overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute -top-28 -left-24 w-110 h-110 rounded-full bg-[radial-gradient(circle,rgba(109,40,217,0.2)_0%,transparent_68%)] animate-pulse pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-95 h-95 rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.16)_0%,transparent_68%)] animate-[pulse_5s_ease-in-out_1.5s_infinite] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)] animate-[pulse_4s_ease-in-out_0.8s_infinite] pointer-events-none" />

      {/* ── TOP: header ── */}
      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/25 border border-purple-500/35">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse shrink-0" />
          <span className="text-xs text-purple-300 tracking-wider">
            Analyzing your situation
          </span>
        </div>
        <h1 className="text-[26px] font-medium text-purple-50 tracking-tight leading-snug">
          CalmAI is processing your request
        </h1>
        <p className="text-[13.5px] text-white/30 leading-[1.7] max-w-70 transition-all duration-500">
          {subMsg}
        </p>
      </div>

      {/* ── MIDDLE: animated orb ── */}
      <div className="relative z-10 flex items-center justify-center w-55 h-55">
        {/* subtle base glow */}
        <div className="absolute inset-0 rounded-full bg-purple-900/10" />

        {/* spinning rings */}
        <div className="absolute inset-3 rounded-full border border-purple-500/28 animate-spin [animation-duration:3s]" />
        <div className="absolute inset-6 rounded-full border border-dashed border-indigo-500/20 animate-spin [animation-duration:2s] [animation-direction:reverse]" />
        <div className="absolute inset-10 rounded-full border border-purple-400/15 animate-spin [animation-duration:5s]" />

        {/* core */}
        <div className="relative z-10 w-25 h-25 rounded-full bg-purple-900/40 border border-purple-500/40 flex flex-col items-center justify-center gap-2">
          <BrainIcon />
          <div className="flex gap-1 items-center">
            {[0, 0.2, 0.4].map((delay, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        </div>

        {/* floating particles */}
        <span className="absolute top-4.5 left-7 w-2 h-2 rounded-full bg-purple-400/50 animate-bounce [animation-duration:2.3s]" />
        <span className="absolute top-7 right-5.5 w-1.5 h-1.5 rounded-full bg-indigo-400/45 animate-bounce [animation-duration:2.9s] [animation-delay:0.5s]" />
        <span className="absolute bottom-5.5 left-6 w-1 h-1 rounded-full bg-purple-400/40 animate-bounce [animation-duration:2.6s] [animation-delay:0.9s]" />
        <span className="absolute bottom-4.5 right-7 w-1.5 h-1.5 rounded-full bg-indigo-300/40 animate-bounce [animation-duration:3s] [animation-delay:0.3s]" />
      </div>

      {/* ── BOTTOM: progress + cards ── */}
      <div className="relative z-10 w-full max-w-lg flex flex-col gap-4">
        {/* main progress bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/35 tracking-wide">
              {progressLabel}
            </span>
            <span className="text-xs text-purple-300/70 font-medium tabular-nums">
              {pct}%
            </span>
          </div>
          <div className="h-1 rounded-full bg-white/8 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-linear-to-r from-purple-600 to-indigo-500 transition-[width] duration-700 ease-in-out"
              style={{ width: `${pct}%` }}
            />
            {/* shimmer overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent animate-[shimmer_1.8s_ease-in-out_infinite] -translate-x-full" />
          </div>
        </div>

        {/* 3 status cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <StatusCard
            icon={<CheckIcon />}
            iconBg="bg-emerald-900/20 border border-emerald-500/30"
            label="Understanding"
            value="Situation mapped"
            barColor="#34d399"
            barWidth={100}
            badge="done"
            delay="0.05s"
          />
          <StatusCard
            icon={<ClockIcon />}
            iconBg="bg-indigo-900/20 border border-indigo-500/30"
            label="AI analysis"
            value={card2Val}
            barColor="#818cf8"
            barWidth={bar2w}
            badge={card2Badge}
            delay="0.15s"
          />
          <StatusCard
            icon={<ListIcon />}
            iconBg="bg-purple-900/20 border border-purple-500/28"
            label="Preparing steps"
            value={card3Val}
            barColor="#a78bfa"
            barWidth={bar3w}
            badge={card3Badge}
            delay="0.25s"
          />
        </div>
      </div>
    </div>
  );
}
