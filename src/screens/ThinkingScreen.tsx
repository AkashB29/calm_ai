"use client";
import { useEffect, useState } from "react";

export default function ThinkingScreen() {
  const [dots, setDots] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);

  const messages = [
    "Analyzing your situation",
    "Understanding your crisis",
    "Preparing your steps",
    "Almost ready",
  ];

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);

    const msgInterval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 2000);

    return () => {
      clearInterval(dotInterval);
      clearInterval(msgInterval);
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-5 py-8">
      <div className="relative mb-12 flex h-48 w-48 items-center justify-center sm:h-64 sm:w-64">
        {/* Outer rings */}
        <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-3xl animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-purple-500/20 blur-2xl animate-pulse delay-300" />
        <div className="absolute inset-8 rounded-full bg-slate-900/80" />

        {/* Inner rotating elements */}
        <div
          className="absolute inset-12 rounded-full border-2 border-purple-500/30 animate-spin"
          style={{ animationDuration: "3s" }}
        />
        <div
          className="absolute inset-16 rounded-full border-2 border-blue-500/20 animate-spin"
          style={{ animationDuration: "2s", animationDirection: "reverse" }}
        />

        {/* Center icon */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-purple-500/20 to-blue-500/20 ring-1 ring-white/10">
          <span className="text-5xl animate-pulse">🧠</span>
        </div>

        {/* Floating particles */}
        <div className="absolute top-4 left-8 h-2 w-2 rounded-full bg-purple-400 animate-bounce delay-100" />
        <div className="absolute top-12 right-6 h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce delay-500" />
        <div className="absolute bottom-8 left-12 h-1 w-1 rounded-full bg-pink-400 animate-bounce delay-700" />
        <div className="absolute bottom-12 right-8 h-2 w-2 rounded-full bg-indigo-400 animate-bounce delay-300" />
      </div>

      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl text-center sm:p-12">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500 mb-4">
          Analyzing your situation
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 bg-linear-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
          CalmAI is processing your request
        </h1>

        <div className="space-y-6">
          {/* Progress bar */}
          <div className="flex justify-center">
            <div className="h-2 w-full max-w-xs rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full w-full bg-linear-to-r from-purple-500 via-fuchsia-500 to-blue-500 animate-[shimmer_2s_ease-in-out_infinite]" />
            </div>
          </div>

          {/* Status cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-2xl bg-slate-900/50 p-4 border border-white/5">
              <div className="text-xl mb-2">🎯</div>
              <p className="text-xs font-medium text-white">Understanding</p>
              <div className="mt-2 h-1 bg-slate-700 rounded-full">
                <div className="h-full w-full bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/50 p-4 border border-white/5">
              <div className="text-xl mb-2">🧠</div>
              <p className="text-xs font-medium text-white">AI analysis</p>
              <div className="mt-2 h-1 bg-slate-700 rounded-full">
                <div className="h-full w-3/4 bg-blue-500 rounded-full animate-pulse delay-300" />
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/50 p-4 border border-white/5">
              <div className="text-xl mb-2">📋</div>
              <p className="text-xs font-medium text-white">Preparing</p>
              <div className="mt-2 h-1 bg-slate-700 rounded-full">
                <div className="h-full w-1/2 bg-purple-500 rounded-full animate-pulse delay-500" />
              </div>
            </div>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed">
            We're analyzing your stress signals, understanding the urgency, and
            crafting the most helpful response plan for your situation.
          </p>
        </div>
      </div>
    </div>
  );
}
