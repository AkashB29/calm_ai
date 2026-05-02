"use client";
import { useState, useEffect } from "react";
import { Phone, ExternalLink, ChevronRight } from "lucide-react";
import { CrisisResponse } from "@/types";

interface TunnelScreenProps {
  crisis: CrisisResponse;
  stressLevel: string;
  onDone: () => void;
}

export default function TunnelScreen({
  crisis,
  stressLevel,
  onDone,
}: TunnelScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  const step = crisis.steps[currentStep];
  const isLast = currentStep === crisis.steps.length - 1;
  const isCritical = stressLevel === "critical";

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.lang = "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (step) speak(step.action + ". " + step.detail);
  }, [currentStep, step]);

  const handleNext = () => {
    setCompleted((p) => [...p, currentStep]);
    if (isLast) {
      onDone();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col px-5 py-8 text-white relative overflow-hidden ${isCritical ? "bg-linear-to-br from-red-950 via-red-900/20 to-red-950" : "bg-linear-to-br from-slate-950 via-purple-950/20 to-slate-950"}`}
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 relative z-10">
        {/* Header */}
        <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-6 sm:p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500 mb-2">
                Your action plan
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white bg-linear-to-r from-white via-purple-200 to-blue-200 bg-clip-text">
                Step-by-step guidance
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Follow each step calmly and methodically
              </p>
            </div>
            <div
              className={`self-start sm:self-auto rounded-full px-5 py-2 text-xs font-bold border ${
                isCritical
                  ? "bg-red-500/10 text-red-200 border-red-500/20"
                  : "bg-purple-500/10 text-purple-200 border-purple-500/20"
              }`}
            >
              {isCritical ? "🚨 Critical response" : "⚡ Urgent help"}
            </div>
          </div>
        </div>

        {/* Emergency call - if applicable */}
        {crisis.emergencyCall && currentStep === 0 && (
          <a
            href={`tel:${crisis.emergencyCall}`}
            className="group rounded-2xl bg-linear-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 px-6 py-5 text-center text-lg font-bold text-white shadow-2xl shadow-red-500/25 transition-all duration-300 hover:shadow-red-500/40 hover:scale-[1.02]"
          >
            <span className="inline-flex items-center justify-center gap-3">
              <Phone size={24} className="group-hover:animate-pulse" />
              Call {crisis.emergencyCall} immediately
              <ChevronRight size={20} />
            </span>
          </a>
        )}

        {/* Current step */}
        <div
          className={`rounded-3xl border border-white/10 px-8 py-10 text-center relative overflow-hidden ${
            isCritical ? "bg-red-900/90" : "bg-purple-900/90"
          } shadow-2xl backdrop-blur-xl`}
        >
          {/* Step background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-16 h-16 border border-white rounded-full" />
            <div className="absolute top-6 right-6 w-12 h-12 border border-white rounded-full" />
            <div className="absolute bottom-4 left-8 w-10 h-10 border border-white rounded-full" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
              <span className="text-xs font-bold text-white">
                Step {currentStep + 1} of {crisis.steps.length}
              </span>
            </div>

            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              {step?.detail}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
              {step?.action}
            </h2>

            <div className="flex items-center justify-center gap-2 text-slate-400">
              <span className="text-xs">⏱️</span>
              <span className="text-xs font-medium">
                Duration: {step?.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Action link - if applicable */}
        {step?.link && (
          <a
            href={step.link}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl bg-linear-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 px-6 py-4 text-center text-base font-bold text-white shadow-2xl shadow-sky-500/25 transition-all duration-300 hover:shadow-sky-500/40 hover:scale-[1.02]"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <ExternalLink size={18} />
              {step.linkLabel || "Open service link"}
              <ChevronRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </a>
        )}

        {/* Next button */}
        <button
          onClick={handleNext}
          className={`group w-full rounded-2xl py-5 text-base font-bold transition-all duration-300 shadow-2xl hover:scale-[1.02] ${
            isLast
              ? "bg-linear-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 shadow-emerald-500/25 hover:shadow-emerald-500/40"
              : "bg-linear-to-r from-white to-slate-100 hover:from-slate-100 hover:to-white text-slate-950 shadow-white/25 hover:shadow-white/40"
          }`}
        >
          <span className="inline-flex items-center justify-center gap-2">
            {isLast ? "🎉 Complete the plan" : "✅ Complete this step"}
            {!isLast && (
              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            )}
          </span>
        </button>

        {/* Progress indicators */}
        <div className="flex flex-wrap justify-center gap-3">
          {crisis.steps.map((_, i) => (
            <div
              key={i}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                completed.includes(i)
                  ? "bg-emerald-500 border-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25"
                  : i === currentStep
                    ? "bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-500/25 animate-pulse"
                    : "bg-slate-800/50 border-white/20 text-slate-400"
              }`}
            >
              <span className="text-xs font-bold">{i + 1}</span>
              {completed.includes(i) && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
