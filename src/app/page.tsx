"use client";

import { useState } from "react";
import { useAI } from "@/hooks/useAI";
import { useVoiceStress } from "@/hooks/useVoiceStress";
import { useTextStress } from "@/hooks/useTextStress";
import { useCombinedStress } from "@/hooks/useCombinedStress";
import { useFaceStress } from "@/hooks/useFaceStress";

import HomeScreen from "@/screens/HomeScreen";
import ThinkingScreen from "@/screens/ThinkingScreen";
import BreathingScreen from "@/screens/BreathingScreen";
import TunnelScreen from "@/screens/TunnelScreen";
import DoneScreen from "@/screens/DoneScreen";

import { AppPhase, CrisisResponse, StressData } from "@/types";

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("home");
  const [crisis, setCrisis] = useState<CrisisResponse | null>(null);

  const [stressData, setStressData] = useState<StressData>({
    faceStress: 0,
    voiceStress: 0,
    textStress: 0,
    combined: 0,
    level: "normal",
    expression: "Neutral",
  });

  const { getAIResponse } = useAI();
  const { voiceStress, listening, startListening } = useVoiceStress();
  const { analyzeTextStress } = useTextStress();
  const { getCombinedStress } = useCombinedStress();
  const { videoRef, faceStress, cameraReady, modelsLoaded } = useFaceStress();

  // ---------------- HANDLERS ----------------

  const handleVoiceInput = () => {
    startListening(async (text: string) => {
      const combined = getCombinedStress(faceStress, voiceStress, 0, "voice");

      setStressData(combined);
      setPhase("thinking");

      const result = await getAIResponse(text, combined);

      if (result) {
        setCrisis(result);
        setPhase(result.needsBreathing ? "breathing" : "tunnel");
      }
    });
  };

  const handleTextInput = async (text: string, mode: "text" | "button") => {
    const textStress = analyzeTextStress(text);

    const combined = getCombinedStress(
      faceStress,
      0,
      textStress,
      mode === "button" ? "button" : "text",
    );

    setStressData(combined);
    setPhase("thinking");

    const result = await getAIResponse(text, combined);

    if (result) {
      setCrisis(result);
      setPhase(result.needsBreathing ? "breathing" : "tunnel");
    }
  };

  const handleReset = () => {
    setCrisis(null);
    setPhase("home");
  };

  // ---------------- UI HELPERS ----------------

  const stressLabel =
    faceStress >= 70 ? "CRITICAL" : faceStress >= 40 ? "HIGH" : "CALM";

  const stressColor =
    faceStress >= 70
      ? "text-red-500"
      : faceStress >= 40
        ? "text-yellow-400"
        : "text-green-400";

  return (
    <>
      <video ref={videoRef} className="hidden" autoPlay muted playsInline />

      <div className="relative min-h-screen overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-purple-950/20 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,119,198,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(120,219,226,0.1),transparent_50%)]" />

        {/* Floating orbs */}
        <div className="absolute top-20 left-10  h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-linear-to-r from-purple-500/5 via-transparent to-blue-500/5 rounded-full blur-3xl animate-pulse delay-500" />

        {/* Header */}
        <header className="relative z-10 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/25">
                  <span className="text-2xl">🧠</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">CalmAI</h1>
                  <p className="text-sm text-slate-400">
                    AI-powered crisis support
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden items-center gap-2 rounded-full bg-slate-800/50 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10 sm:flex">
                  <div
                    className={`h-2 w-2 rounded-full ${cameraReady ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`}
                  />
                  {cameraReady ? "Face detection active" : "Initializing..."}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stress indicator - only on home */}
        {phase === "home" && (
          <div className="relative z-10 mx-auto max-w-7xl px-6 py-4">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      faceStress >= 70
                        ? "bg-red-500/20 text-red-300"
                        : faceStress >= 40
                          ? "bg-orange-500/20 text-orange-300"
                          : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {faceStress >= 70 ? "😨" : faceStress >= 40 ? "😟" : "😌"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Current stress level
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        faceStress >= 70
                          ? "text-red-300"
                          : faceStress >= 40
                            ? "text-orange-300"
                            : "text-emerald-300"
                      }`}
                    >
                      {modelsLoaded ? `${faceStress}%` : "Analyzing..."}
                    </p>
                  </div>
                </div>

                <div className="hidden w-32 sm:block">
                  <div className="h-2 rounded-full bg-slate-700">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${
                        faceStress >= 70
                          ? "bg-linear-to-r from-red-500 to-red-400"
                          : faceStress >= 40
                            ? "bg-linear-to-r from-orange-500 to-orange-400"
                            : "bg-linear-to-r from-emerald-500 to-emerald-400"
                      }`}
                      style={{ width: `${faceStress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="relative z-10">
          {phase === "home" && (
            <HomeScreen
              onVoiceInput={handleVoiceInput}
              onTextInput={handleTextInput}
              faceStress={faceStress}
              listening={listening}
            />
          )}
          {phase === "thinking" && <ThinkingScreen />}
          {phase === "breathing" && crisis && (
            <BreathingScreen
              calming={crisis.calming}
              onDone={() => setPhase("tunnel")}
            />
          )}
          {phase === "tunnel" && crisis && (
            <TunnelScreen
              crisis={crisis}
              stressLevel={stressData.level}
              onDone={() => setPhase("done")}
            />
          )}
          {phase === "done" && crisis && (
            <DoneScreen crisis={crisis} onReset={handleReset} />
          )}
        </main>
      </div>
    </>
  );
}
