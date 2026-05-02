"use client";
import { useEffect, useState } from "react";

interface BreathingScreenProps {
  calming: string;
  onDone: () => void;
}

export default function BreathingScreen({
  calming,
  onDone,
}: BreathingScreenProps) {
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    const breathInterval = setInterval(() => {
      setPhase((p) => (p === "in" ? "out" : "in"));
    }, 4000);

    const countInterval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          onDone();
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => {
      clearInterval(breathInterval);
      clearInterval(countInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-purple-950/20 to-slate-950 flex flex-col items-center justify-center px-5 py-8 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500" />

      <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center gap-8">
        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-purple-500/10 border border-purple-500/20">
            <span className="text-xl">💜</span>
            <p className="text-sm text-purple-300 font-medium">{calming}</p>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white bg-linear-to-r from-white via-purple-200 to-blue-200 bg-clip-text">
            Take a deep breath
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-md">
            Let's calm your mind and focus on what matters most right now.
          </p>
        </div>

        {/* Breathing animation */}
        <div className="relative flex items-center justify-center py-8">
          {/* Outer breathing rings */}
          <div
            className={`absolute rounded-full border-2 border-purple-500/20 transition-all duration-4000 ease-in-out ${
              phase === "in"
                ? "w-64 h-64 scale-100 opacity-60"
                : "w-40 h-40 scale-75 opacity-30"
            }`}
          />
          <div
            className={`absolute rounded-full border border-blue-500/15 transition-all duration-4000 ease-in-out ${
              phase === "in"
                ? "w-56 h-56 scale-100 opacity-50"
                : "w-32 h-32 scale-75 opacity-20"
            }`}
          />
          <div
            className={`absolute bg-linear-to-br from-purple-500/20 to-blue-500/20 transition-all duration-4000 ease-in-out ${
              phase === "in" ? "w-48 h-48" : "w-28 h-28"
            }`}
          />

          {/* Center breathing circle */}
          <div
            className={`relative z-10 rounded-full bg-linear-to-br from-purple-600 to-blue-600 flex flex-col items-center justify-center transition-all duration-4000 ease-in-out shadow-2xl shadow-purple-500/25 ${
              phase === "in" ? "w-36 h-36" : "w-20 h-20"
            }`}
          >
            <div className="text-center">
              <p className="text-white font-bold text-lg sm:text-xl mb-0.5">
                {phase === "in" ? "Breathe" : "Release"}
              </p>
              <p className="text-purple-200 text-xs sm:text-sm font-medium">
                {phase === "in" ? "Inhale deeply..." : "Exhale slowly..."}
              </p>
            </div>
          </div>

          {/* Floating particles */}
          <div className="absolute top-6 left-6 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100 opacity-60" />
          <div className="absolute top-12 right-8 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-300 opacity-60" />
          <div className="absolute bottom-10 left-10 w-1 h-1 bg-pink-400 rounded-full animate-bounce delay-500 opacity-60" />
          <div className="absolute bottom-12 right-6 w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-700 opacity-60" />
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <div className="text-4xl font-bold text-white">{countdown}</div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              seconds remaining
            </p>
          </div>

          <button
            onClick={onDone}
            className="px-8 py-4 rounded-2xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 text-slate-300 hover:text-white transition-all duration-300 backdrop-blur-sm"
          >
            Skip breathing exercise
          </button>
        </div>
      </div>
    </div>
  );
}
