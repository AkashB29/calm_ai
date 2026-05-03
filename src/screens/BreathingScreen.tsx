"use client";
import { useEffect, useRef, useState } from "react";

interface BreathingScreenProps {
  calming?: string;
  durationSeconds?: number;
  onDone: () => void;
}

export default function BreathingScreen({
  calming = "You're doing great",
  durationSeconds = 8,
  onDone,
}: BreathingScreenProps) {
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [countdown, setCountdown] = useState(durationSeconds);
  const [finished, setFinished] = useState(false);
  const breathRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (breathRef.current) clearInterval(breathRef.current);
    if (countRef.current) clearInterval(countRef.current);
  };

  const handleDone = () => {
    clearTimers();
    setFinished(true);
  };

  const handleRestart = () => {
    setFinished(false);
    setCountdown(durationSeconds);
    setPhase("in");
  };

  useEffect(() => {
    if (finished) return;

    breathRef.current = setInterval(() => {
      setPhase((p) => (p === "in" ? "out" : "in"));
    }, 4000);

    countRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          handleDone();
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return clearTimers;
  }, [finished]);

  const progressPct = Math.max(0, (countdown / durationSeconds) * 100);
  const isIn = phase === "in";

  /* ── Done state ── */
  if (finished) {
    return (
      <div className="fixed inset-0 bg-[#08061a] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(109,40,217,0.2)_0%,transparent_70%)] animate-pulse pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.16)_0%,transparent_70%)] animate-pulse pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-5 text-center max-w-xs">
          <div className="w-18 h-18 rounded-full bg-purple-900/30 border border-purple-500/40 flex items-center justify-center">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="#a78bfa"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <h2 className="text-[26px] font-medium text-purple-50 tracking-tight mb-2">
              Feeling calmer?
            </h2>
            <p className="text-[13.5px] text-white/30 leading-relaxed">
              Your breathing exercise is complete.
              <br />
              You&apos;re ready to focus.
            </p>
          </div>

          <div className="flex gap-3 mt-1">
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 rounded-xl bg-white/6 border border-white/12 text-white/40 text-[13px] hover:bg-white/10 hover:text-white/70 transition-all"
            >
              Start again
            </button>
            <button
              onClick={onDone}
              className="px-6 py-2.5 rounded-xl bg-purple-700/55 border border-purple-500/40 text-purple-100 text-[13px] hover:bg-purple-700/75 transition-all"
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main breathing state ── */
  return (
    <div className="fixed inset-0 bg-[#08061a] flex flex-col items-center justify-between px-6 py-12 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-28 -left-28 w-115 h-115 rounded-full bg-[radial-gradient(circle,rgba(109,40,217,0.22)_0%,transparent_70%)] animate-pulse pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-95 h-95 rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.18)_0%,transparent_70%)] animate-[pulse_6s_ease-in-out_infinite] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)] animate-[pulse_5s_ease-in-out_2s_infinite] pointer-events-none" />

      {/* TOP — Header */}
      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/25 border border-purple-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
          <span className="text-xs text-purple-300 tracking-wide">
            {calming}
          </span>
        </div>
        <h1 className="text-[28px] font-medium text-purple-50 tracking-tight leading-tight">
          Take a deep breath
        </h1>
        <p className="text-[13.5px] text-white/30 leading-[1.7] max-w-65">
          Let&apos;s calm your mind and focus on what matters most right now.
        </p>
      </div>

      {/* MIDDLE — Orb */}
      <div className="relative z-10 flex items-center justify-center w-75 h-75">
        {/* Outer ring */}
        <div
          className="absolute rounded-full border border-purple-900/40 transition-all duration-4000 ease-in-out"
          style={{
            width: isIn ? "290px" : "215px",
            height: isIn ? "290px" : "215px",
            opacity: isIn ? 0.35 : 0.12,
          }}
        />
        {/* Mid ring */}
        <div
          className="absolute rounded-full border border-purple-700/30 transition-all duration-4000 ease-in-out"
          style={{
            width: isIn ? "245px" : "178px",
            height: isIn ? "245px" : "178px",
            opacity: isIn ? 0.6 : 0.22,
          }}
        />
        {/* Inner ring */}
        <div
          className="absolute rounded-full border border-purple-500/30 transition-all duration-4000 ease-in-out"
          style={{
            width: isIn ? "195px" : "138px",
            height: isIn ? "195px" : "138px",
            opacity: isIn ? 1 : 0.4,
          }}
        />

        {/* Core orb */}
        <div
          className="relative z-10 rounded-full bg-linear-to-br from-purple-600 to-indigo-600 flex flex-col items-center justify-center transition-all duration-4000 ease-in-out"
          style={{
            width: isIn ? "144px" : "86px",
            height: isIn ? "144px" : "86px",
          }}
        >
          <span className="text-[16px] font-medium text-purple-50 leading-tight">
            {isIn ? "Breathe" : "Release"}
          </span>
          <span className="text-[11.5px] text-purple-200/55 mt-0.5">
            {isIn ? "Inhale deeply" : "Exhale slowly"}
          </span>
        </div>

        {/* Floating particles */}
        <span className="absolute top-5.5 left-8.5 w-2 h-2 rounded-full bg-purple-400/50 animate-bounce [animation-duration:2.3s]" />
        <span className="absolute top-7.5 right-6.5 w-1.5 h-1.5 rounded-full bg-purple-300/45 animate-bounce [animation-duration:2.9s] [animation-delay:0.5s]" />
        <span className="absolute bottom-6.5 left-6.5 w-1 h-1 rounded-full bg-purple-400/40 animate-bounce [animation-duration:2.6s] [animation-delay:0.9s]" />
        <span className="absolute bottom-5.5 right-8 w-1.5 h-1.5 rounded-full bg-purple-300/40 animate-bounce [animation-duration:3s] [animation-delay:0.3s]" />
      </div>

      {/* BOTTOM — Countdown + progress + skip */}
      <div className="relative z-10 flex flex-col items-center gap-4 w-full max-w-75">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[52px] font-medium text-purple-50 leading-none tabular-nums">
            {countdown}
          </span>
          <span className="text-[11px] text-white/28 uppercase tracking-widest">
            seconds remaining
          </span>
        </div>

        <div className="w-full h-0.75 bg-white/7 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500/75 rounded-full transition-[width] duration-1000 ease-linear"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <button
          onClick={handleDone}
          className="mt-1 px-7 py-3 rounded-xl bg-white/6 border border-white/12 text-white/40 text-[13px] hover:bg-white/10 hover:text-white/68 transition-all"
        >
          Skip breathing exercise
        </button>
      </div>
    </div>
  );
}
