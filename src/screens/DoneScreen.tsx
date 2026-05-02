"use client";
import { CheckCircle } from "lucide-react";
import { CrisisResponse } from "@/types";

interface DoneScreenProps {
  crisis: CrisisResponse;
  onReset: () => void;
}

export default function DoneScreen({ crisis, onReset }: DoneScreenProps) {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-5 py-8 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="rounded-3xl border border-white/10 bg-slate-950/95 p-8 sm:p-10 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-8 text-center">
            {/* Success animation */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl animate-pulse" />
              <div className="relative rounded-full bg-linear-to-br from-emerald-500 to-green-500 p-5 shadow-2xl shadow-emerald-500/25">
                <CheckCircle size={64} className="text-white animate-bounce" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-white via-emerald-200 to-blue-200 bg-clip-text text-transparent">
                You're in control
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg mt-2">
                You've successfully completed all the steps. Take a moment to
                breathe and reflect on what you've accomplished.
              </p>
            </div>
          </div>

          {/* Steps summary */}
          <div className="mt-10">
            <h3 className="text-lg font-bold text-white mb-6 text-center">
              Steps you completed
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {crisis.steps.map((step, i) => (
                <div
                  key={i}
                  className="group rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/10 hover:bg-slate-800/80 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-emerald-500/10"
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs shrink-0 group-hover:scale-110 transition-transform duration-300">
                      ✓
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500 mb-1">
                        Step {i + 1}
                      </p>
                      <p className="text-sm font-bold text-white leading-tight group-hover:text-emerald-200 transition-colors line-clamp-2">
                        {step.action}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Encouragement section */}
          <div className="mt-10 rounded-2xl border border-white/10 bg-slate-900/50 p-6 sm:p-8 backdrop-blur-xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <span className="text-lg">💪</span>
                <span className="text-sm text-emerald-300 font-medium">
                  Well done!
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                You've taken important steps forward
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-lg mx-auto">
                Remember, seeking help is a sign of strength, not weakness.
                You're not alone in this, and there are people and resources
                ready to support you.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onReset}
              className="px-8 py-4 rounded-2xl bg-linear-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-[1.02]"
            >
              Start Over
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 rounded-2xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 text-white font-medium text-base backdrop-blur-sm transition-all duration-300 hover:border-white/20"
            >
              Close App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
