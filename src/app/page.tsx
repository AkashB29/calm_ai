"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAI } from "@/hooks/useAI";
import { useVoiceStress } from "@/hooks/useVoiceStress";
import { useTextStress } from "@/hooks/useTextStress";
import { useCombinedStress } from "@/hooks/useCombinedStress";
import { useFaceStress } from "@/hooks/useFaceStress";

import ThinkingScreen from "@/screens/ThinkingScreen";
import BreathingScreen from "@/screens/BreathingScreen";
import TunnelScreen from "@/screens/TunnelScreen";
import DoneScreen from "@/screens/DoneScreen";

import { AppPhase, CrisisResponse, StressData } from "@/types";

/* ─────────────────────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────────────────────── */
const DETECTION_TIMEOUT_SECONDS = 60;

/* ─────────────────────────────────────────────────────────────────────────────
   Stress helpers
───────────────────────────────────────────────────────────────────────────── */
function stressColor(score: number) {
  if (score >= 75) return "#ef4444";
  if (score >= 50) return "#f97316";
  if (score >= 25) return "#eab308";
  return "#22c55e";
}
function stressLabel(score: number) {
  if (score >= 75) return "Critical";
  if (score >= 50) return "High";
  if (score >= 25) return "Moderate";
  return "Calm";
}

/* ─────────────────────────────────────────────────────────────────────────────
   MetricBar
───────────────────────────────────────────────────────────────────────────── */
function MetricBar({
  name,
  value,
  active,
}: {
  name: string;
  value: number | null;
  active: boolean;
}) {
  const pct = value ?? 0;
  const barColor = stressColor(pct);
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        padding: "11px 14px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 7,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: active && value !== null ? barColor : "#475569",
          }}
        >
          {active && value !== null ? `${value}%` : "—"}
        </span>
      </div>
      <div
        style={{
          height: 3,
          background: "rgba(255,255,255,0.07)",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg,#7c3aed,${barColor})`,
            borderRadius: 99,
            transition: "width 1s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ScoreCircle
───────────────────────────────────────────────────────────────────────────── */
function ScoreCircle({ score }: { score: number }) {
  const color = stressColor(score);
  const label = stressLabel(score);
  const circumference = 2 * Math.PI * 38;
  const dashOffset = circumference - (score / 100) * circumference;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        padding: "14px 16px",
      }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <svg width={88} height={88} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={44}
            cy={44}
            r={38}
            fill="none"
            stroke="#1f2937"
            strokeWidth={6}
          />
          <circle
            cx={44}
            cy={44}
            r={38}
            fill="none"
            stroke={color}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease",
            }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1,
            }}
          >
            {score}
          </span>
          <span style={{ fontSize: 9, color: "#64748b" }}>/100</span>
        </div>
      </div>
      <div>
        <p
          style={{
            fontSize: 10,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 4,
          }}
        >
          Stress level
        </p>
        <p style={{ fontSize: 20, fontWeight: 700, color, marginBottom: 6 }}>
          {label}
        </p>
        <p style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>
          {score >= 75
            ? "🔴 Immediate action needed"
            : score >= 50
              ? "🟠 Elevated — monitor"
              : score >= 25
                ? "🟡 Slight tension"
                : "🟢 User appears calm"}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HistoryGraph
───────────────────────────────────────────────────────────────────────────── */
function HistoryGraph({ history }: { history: number[] }) {
  if (history.length < 2) return null;
  const avg = Math.round(history.reduce((a, b) => a + b, 0) / history.length);
  const peak = Math.max(...history);
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <p
          style={{
            fontSize: 10,
            color: "#64748b",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          History — last {history.length}
        </p>
        <div
          style={{ display: "flex", gap: 10, fontSize: 10, color: "#475569" }}
        >
          <span>avg: {avg}</span>
          <span>peak: {peak}</span>
        </div>
      </div>
      <div
        style={{ display: "flex", alignItems: "flex-end", gap: 1, height: 48 }}
      >
        {history.map((val, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              borderRadius: 2,
              height: `${Math.max(2, val)}%`,
              backgroundColor: stressColor(val),
              opacity: 0.3 + (i / history.length) * 0.7,
              transition: "height 200ms ease",
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 4,
        }}
      >
        {["0", "50", "100"].map((l) => (
          <span key={l} style={{ fontSize: 9, color: "#374151" }}>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Detection Status Banner
───────────────────────────────────────────────────────────────────────────── */
function DetectionStatusBanner({
  detecting,
  secondsLeft,
  frozenScore,
}: {
  detecting: boolean;
  secondsLeft: number;
  frozenScore: number | null;
}) {
  if (!detecting && frozenScore === null) return null;

  const color = frozenScore !== null ? stressColor(frozenScore) : "#a78bfa";
  const pct = Math.round((secondsLeft / DETECTION_TIMEOUT_SECONDS) * 100);

  return (
    <div
      style={{
        margin: "10px 16px 0",
        borderRadius: 12,
        border: `1px solid ${detecting ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.08)"}`,
        background: detecting
          ? "rgba(124,58,237,0.1)"
          : "rgba(255,255,255,0.03)",
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: detecting ? "#a78bfa" : color,
              display: "inline-block",
              animation: detecting ? "blink 1s ease-in-out infinite" : "none",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 11,
              color: detecting ? "#c4b5fd" : "#64748b",
              fontWeight: 500,
            }}
          >
            {detecting ? "Face detection running…" : "Detection complete"}
          </span>
        </div>
        {detecting && (
          <span
            style={{
              fontSize: 11,
              color: secondsLeft <= 15 ? "#f97316" : "#64748b",
              fontWeight: 500,
            }}
          >
            {secondsLeft}s
          </span>
        )}
        {!detecting && frozenScore !== null && (
          <span style={{ fontSize: 11, color, fontWeight: 600 }}>
            {frozenScore}% · {stressLabel(frozenScore)}
          </span>
        )}
      </div>

      {detecting && (
        <div
          style={{
            height: 3,
            background: "rgba(255,255,255,0.07)",
            borderRadius: 99,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: "linear-gradient(90deg,#7c3aed,#a78bfa)",
              borderRadius: 99,
              transition: "width 1s linear",
            }}
          />
        </div>
      )}

      {!detecting && frozenScore !== null && (
        <p style={{ fontSize: 11, color: "#475569", lineHeight: 1.5 }}>
          Stress captured and locked in. Camera stopped.
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DetectionToggle tab
───────────────────────────────────────────────────────────────────────────── */
function DetectionToggle({
  open,
  onToggle,
  detecting,
  faceStress: fs,
}: {
  open: boolean;
  onToggle: () => void;
  detecting: boolean;
  faceStress: number;
}) {
  if (open) return null;
  const color = stressColor(fs);
  return (
    <button
      onClick={onToggle}
      style={{
        position: "fixed",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        width: 28,
        height: 96,
        background: "rgba(10,13,26,0.9)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255,255,255,0.12)",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        borderLeft: "1px solid rgba(255,255,255,0.12)",
        borderRight: "none",
        borderRadius: "10px 0 0 10px",
        cursor: "pointer",
        padding: 0,
        animation: "tabFadeIn 0.18s ease",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: detecting ? "#a78bfa" : color,
          display: "inline-block",
          animation: detecting ? "blink 1s ease-in-out infinite" : "none",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 9,
          color: "#94a3b8",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          transform: "rotate(180deg)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        Detection
      </span>
      <span
        style={{ fontSize: 11, color: "#64748b", lineHeight: 1, flexShrink: 0 }}
      >
        ‹
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────────────────────────────── */
export default function Home() {
  const [phase, setPhase] = useState<AppPhase>("home");
  const [crisis, setCrisis] = useState<CrisisResponse | null>(null);
  const [inputText, setInputText] = useState("");
  const [panelOpen, setPanelOpen] = useState(true);
  const [history, setHistory] = useState<number[]>([]);
  const [stressData, setStressData] = useState<StressData>({
    faceStress: 0,
    voiceStress: 0,
    textStress: 0,
    combined: 0,
    level: "normal",
    expression: "Neutral",
  });

  const [detectionState, setDetectionState] = useState<
    "idle" | "detecting" | "done"
  >("idle");
  const [detectionSecondsLeft, setDetectionSecondsLeft] = useState(
    DETECTION_TIMEOUT_SECONDS,
  );
  const [frozenFaceStress, setFrozenFaceStress] = useState<number | null>(null);

  const detectionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { getAIResponse } = useAI();
  const { voiceStress, listening, startListening } = useVoiceStress();
  const { analyzeTextStress } = useTextStress();
  const { getCombinedStress } = useCombinedStress();

  // ── KEY CHANGE: destructure stopCamera from the hook ──
  const { videoRef, faceStress, cameraReady, modelsLoaded, stopCamera } =
    useFaceStress();

  // Always-fresh ref so the interval closure never reads a stale faceStress
  const latestFaceStress = useRef(faceStress);
  latestFaceStress.current = faceStress;

  /* ── History tracking (only when actively detecting) ── */
  const prevStress = useRef(-1);
  if (
    detectionState === "detecting" &&
    modelsLoaded &&
    faceStress !== prevStress.current
  ) {
    prevStress.current = faceStress;
    setHistory((h) => [...h.slice(-29), faceStress]);
  }

  /* ── Stop detection: freeze score + kill camera imperatively ── */
  const stopDetection = useCallback(
    (finalScore: number) => {
      if (detectionTimerRef.current) {
        clearInterval(detectionTimerRef.current);
        detectionTimerRef.current = null;
      }
      setFrozenFaceStress(finalScore);
      setDetectionState("done");
      stopCamera(); // ← direct call — no React re-render race, kills light immediately
    },
    [stopCamera],
  );

  /* ── Start background detection countdown ── */
  const startDetection = useCallback(() => {
    setDetectionState("detecting");
    setDetectionSecondsLeft(DETECTION_TIMEOUT_SECONDS);
    setFrozenFaceStress(null);

    let remaining = DETECTION_TIMEOUT_SECONDS;
    detectionTimerRef.current = setInterval(() => {
      remaining -= 1;
      setDetectionSecondsLeft(remaining);
      if (remaining <= 0) {
        stopDetection(latestFaceStress.current);
      }
    }, 1000);
  }, [stopDetection]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      if (detectionTimerRef.current) clearInterval(detectionTimerRef.current);
    };
  }, []);

  /* ── Effective face stress value ── */
  const effectiveFaceStress =
    detectionState === "done" && frozenFaceStress !== null
      ? frozenFaceStress
      : faceStress;

  /* ── Handlers ── */
  const handleVoiceInput = () => {
    startListening(async (text: string) => {
      startDetection();
      const combined = getCombinedStress(
        effectiveFaceStress,
        voiceStress,
        0,
        "voice",
      );
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
    if (!text.trim()) return;
    startDetection();
    const ts = analyzeTextStress(text);
    const combined = getCombinedStress(
      effectiveFaceStress,
      0,
      ts,
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
    setDetectionState("idle");
    setFrozenFaceStress(null);
    setHistory([]);
  };

  const submitText = () => {
    handleTextInput(inputText, "text");
    setInputText("");
  };

  const color = stressColor(effectiveFaceStress);
  const CHIPS = [
    "I'm overwhelmed",
    "Panic attack",
    "Can't breathe",
    "Feeling anxious",
    "I need calm",
    "Heart racing",
  ];

  const isDetecting = detectionState === "detecting";
  const isDetectionDone = detectionState === "done";

  return (
    <>
      <div
        className="w-full h-full"
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          background: "#05070f",
          fontFamily: "'Sora', sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Ambient orbs */}
        {[
          {
            size: 600,
            top: -160,
            left: -160,
            color: "rgba(124,58,237,0.17)",
            delay: "0s",
          },
          {
            size: 500,
            bottom: -120,
            right: 40,
            color: "rgba(37,99,235,0.12)",
            delay: "2.5s",
          },
          {
            size: 320,
            top: "42%",
            left: "55%",
            color: "rgba(52,211,153,0.09)",
            delay: "5s",
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ].map((o: any, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: o.size,
              height: o.size,
              top: o.top,
              left: o.left,
              bottom: o.bottom,
              right: o.right,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
              filter: "blur(80px)",
              pointerEvents: "none",
              animation: `floatOrb 7s ease-in-out infinite ${o.delay}`,
            }}
          />
        ))}

        {/* ── Header ── */}
        <header
          style={{
            position: "relative",
            zIndex: 20,
            height: 64,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(5,7,15,0.85)",
            backdropFilter: "blur(24px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                flexShrink: 0,
                background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                boxShadow: "0 0 22px rgba(124,58,237,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 19,
              }}
            >
              🧠
            </div>
            <div>
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#f1f5f9",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                CalmAI
              </p>
              <p style={{ fontSize: 11, color: "#64748b" }}>
                AI-powered crisis support
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 20,
                border: `1px solid ${isDetecting ? "rgba(167,139,250,0.35)" : "rgba(255,255,255,0.08)"}`,
                background: isDetecting
                  ? "rgba(124,58,237,0.12)"
                  : "rgba(255,255,255,0.04)",
                transition: "all 0.3s",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  display: "inline-block",
                  background: isDetecting
                    ? "#a78bfa"
                    : isDetectionDone
                      ? stressColor(frozenFaceStress ?? 0)
                      : cameraReady
                        ? "#34d399"
                        : "#475569",
                  animation: isDetecting
                    ? "blink 1s ease-in-out infinite"
                    : cameraReady && !isDetectionDone
                      ? "blink 2s ease-in-out infinite"
                      : "none",
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: isDetecting ? "#c4b5fd" : "#94a3b8",
                }}
              >
                {isDetecting
                  ? `Scanning… ${detectionSecondsLeft}s`
                  : isDetectionDone
                    ? `Stress locked · ${frozenFaceStress}%`
                    : cameraReady
                      ? "Ready to detect"
                      : "Initializing…"}
              </span>
            </div>

            {panelOpen && (
              <button
                onClick={() => setPanelOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "6px 14px",
                  borderRadius: 20,
                  border: "1px solid rgba(167,139,250,.45)",
                  background: "rgba(124,58,237,.15)",
                  color: "#c4b5fd",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "'Sora', sans-serif",
                }}
              >
                <span style={{ fontSize: 14 }}>📡</span>
                <span>Hide Detection</span>
                <span style={{ fontSize: 11, opacity: 0.7 }}>›</span>
              </button>
            )}
          </div>
        </header>

        {/* ── Body ── */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            flex: 1,
            display: "flex",
            overflow: "hidden",
          }}
        >
          {phase !== "home" && (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
                <div className="h-full w-full">
                  <DoneScreen crisis={crisis} onReset={handleReset} />
                </div>
              )}
            </div>
          )}

          {/* ── Home layout ── */}
          {phase === "home" && (
            <>
              {/* Left: interaction */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 56px",
                  gap: 26,
                  overflowY: "auto",
                }}
              >
                <div style={{ textAlign: "center", maxWidth: 440 }}>
                  <h2
                    style={{
                      fontSize: 26,
                      fontWeight: 300,
                      fontFamily: "'Playfair Display', serif",
                      color: "#e2e8f0",
                      lineHeight: 1.45,
                      marginBottom: 8,
                    }}
                  >
                    How are you feeling{" "}
                    <em style={{ fontStyle: "italic", color: "#c4b5fd" }}>
                      right now?
                    </em>
                  </h2>
                  <p style={{ fontSize: 13, color: "#64748b" }}>
                    Speak freely — I&apos;m here to listen and help
                  </p>
                </div>

                {/* Text input */}
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    width: "100%",
                    maxWidth: 440,
                  }}
                >
                  <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitText()}
                    placeholder="Type how you're feeling…"
                    style={{
                      flex: 1,
                      height: 46,
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#f1f5f9",
                      fontSize: 14,
                      padding: "0 16px",
                      fontFamily: "'Sora', sans-serif",
                      outline: "none",
                      transition: "border-color .2s",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(167,139,250,0.55)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.1)")
                    }
                  />
                  <button
                    onClick={submitText}
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      flexShrink: 0,
                      background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                      border: "none",
                      color: "#fff",
                      fontSize: 20,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 20px rgba(124,58,237,0.35)",
                      transition: "transform .15s, box-shadow .15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.07)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 28px rgba(124,58,237,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 20px rgba(124,58,237,0.35)";
                    }}
                  >
                    →
                  </button>
                </div>

                {/* OR divider */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    width: "100%",
                    maxWidth: 440,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: "rgba(255,255,255,0.07)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      color: "#475569",
                      letterSpacing: "0.08em",
                    }}
                  >
                    OR
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: "rgba(255,255,255,0.07)",
                    }}
                  />
                </div>

                {/* Mic */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <button
                    onClick={handleVoiceInput}
                    style={{
                      position: "relative",
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: listening
                        ? "linear-gradient(135deg,rgba(124,58,237,.5),rgba(37,99,235,.5))"
                        : "linear-gradient(135deg,rgba(124,58,237,.18),rgba(37,99,235,.18))",
                      border: `1px solid ${listening ? "rgba(167,139,250,.6)" : "rgba(167,139,250,.28)"}`,
                      fontSize: 28,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: listening
                        ? "0 0 40px rgba(167,139,250,.35)"
                        : "none",
                      transition: "all .25s",
                    }}
                  >
                    🎙
                    <span
                      style={{
                        position: "absolute",
                        inset: -10,
                        borderRadius: "50%",
                        border: "1px solid rgba(167,139,250,0.18)",
                        animation: "ripple 2.2s ease-out infinite",
                        pointerEvents: "none",
                      }}
                    />
                    {listening && (
                      <span
                        style={{
                          position: "absolute",
                          inset: -20,
                          borderRadius: "50%",
                          border: "1px solid rgba(167,139,250,0.1)",
                          animation: "ripple 2.2s ease-out infinite 0.6s",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </button>
                  <p style={{ fontSize: 12, color: "#64748b" }}>
                    {listening ? "Listening…" : "Tap to speak"}
                  </p>
                </div>

                {/* Quick chips */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    justifyContent: "center",
                    maxWidth: 420,
                  }}
                >
                  {CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleTextInput(chip, "button")}
                      style={{
                        padding: "7px 15px",
                        borderRadius: 20,
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.04)",
                        color: "#94a3b8",
                        fontSize: 12,
                        cursor: "pointer",
                        fontFamily: "'Sora', sans-serif",
                        transition: "all .2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(167,139,250,.45)";
                        e.currentTarget.style.color = "#c4b5fd";
                        e.currentTarget.style.background =
                          "rgba(167,139,250,.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,.08)";
                        e.currentTarget.style.color = "#94a3b8";
                        e.currentTarget.style.background =
                          "rgba(255,255,255,.04)";
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Right: detection sidebar ── */}
              <aside
                style={{
                  width: panelOpen ? 360 : 0,
                  flexShrink: 0,
                  overflow: "hidden",
                  transition: "width 0.22s cubic-bezier(.4,0,.2,1)",
                  background: "rgba(10,13,26,0.7)",
                  backdropFilter: "blur(24px)",
                  borderLeft: panelOpen
                    ? "1px solid rgba(255,255,255,0.07)"
                    : "none",
                }}
              >
                <div
                  style={{
                    width: 360,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                  }}
                >
                  {/* Panel header */}
                  <div
                    style={{
                      padding: "16px 20px 12px",
                      borderBottom: "1px solid rgba(255,255,255,0.07)",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <p
                        style={{
                          fontSize: 11,
                          color: "#64748b",
                          letterSpacing: "0.09em",
                          textTransform: "uppercase",
                        }}
                      >
                        Live Detection
                      </p>
                      {isDetecting && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 500,
                            color: "#c4b5fd",
                            background: "rgba(124,58,237,0.18)",
                            border: "1px solid rgba(167,139,250,0.3)",
                            padding: "2px 8px",
                            borderRadius: 99,
                            animation: "blink 1.5s ease-in-out infinite",
                          }}
                        >
                          {detectionSecondsLeft}s
                        </span>
                      )}
                      {isDetectionDone && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 500,
                            color: stressColor(frozenFaceStress ?? 0),
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            padding: "2px 8px",
                            borderRadius: 99,
                          }}
                        >
                          Stopped
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setPanelOpen(false)}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.04)",
                        color: "#64748b",
                        fontSize: 14,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: 1,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.09)";
                        e.currentTarget.style.color = "#f1f5f9";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.04)";
                        e.currentTarget.style.color = "#64748b";
                      }}
                    >
                      ×
                    </button>
                  </div>

                  {/* Camera feed */}
                  <div
                    style={{
                      margin: "14px 16px 0",
                      borderRadius: 16,
                      overflow: "hidden",
                      background: "#0a0d1a",
                      border: "1px solid rgba(255,255,255,0.08)",
                      aspectRatio: "4/3",
                      position: "relative",
                      flexShrink: 0,
                    }}
                  >
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transform: "scaleX(-1)",
                        display:
                          cameraReady && !isDetectionDone ? "block" : "none",
                      }}
                    />

                    {/* Detection-done overlay */}
                    {isDetectionDone && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                          background: "rgba(5,7,15,0.88)",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {[
                          {
                            top: 12,
                            left: 12,
                            borderTop: "2px solid rgba(167,139,250,.3)",
                            borderLeft: "2px solid rgba(167,139,250,.3)",
                          },
                          {
                            top: 12,
                            right: 12,
                            borderTop: "2px solid rgba(167,139,250,.3)",
                            borderRight: "2px solid rgba(167,139,250,.3)",
                          },
                          {
                            bottom: 12,
                            left: 12,
                            borderBottom: "2px solid rgba(167,139,250,.3)",
                            borderLeft: "2px solid rgba(167,139,250,.3)",
                          },
                          {
                            bottom: 12,
                            right: 12,
                            borderBottom: "2px solid rgba(167,139,250,.3)",
                            borderRight: "2px solid rgba(167,139,250,.3)",
                          },
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ].map((s: any, i) => (
                          <span
                            key={i}
                            style={{
                              position: "absolute",
                              width: 18,
                              height: 18,
                              ...s,
                            }}
                          />
                        ))}
                        <div
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            background: "rgba(124,58,237,0.2)",
                            border: "1px solid rgba(167,139,250,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 22,
                          }}
                        >
                          ✓
                        </div>
                        <p
                          style={{
                            fontSize: 12,
                            color: "#64748b",
                            textAlign: "center",
                            lineHeight: 1.6,
                            maxWidth: 160,
                          }}
                        >
                          Detection complete.
                          <br />
                          Camera stopped.
                        </p>
                        {frozenFaceStress !== null && (
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: stressColor(frozenFaceStress),
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              padding: "4px 14px",
                              borderRadius: 999,
                            }}
                          >
                            {frozenFaceStress}% ·{" "}
                            {stressLabel(frozenFaceStress)}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Initialising placeholder */}
                    {!cameraReady && !isDetectionDone && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 10,
                        }}
                      >
                        {[
                          {
                            top: 12,
                            left: 12,
                            borderTop: "2px solid rgba(167,139,250,.45)",
                            borderLeft: "2px solid rgba(167,139,250,.45)",
                          },
                          {
                            top: 12,
                            right: 12,
                            borderTop: "2px solid rgba(167,139,250,.45)",
                            borderRight: "2px solid rgba(167,139,250,.45)",
                          },
                          {
                            bottom: 12,
                            left: 12,
                            borderBottom: "2px solid rgba(167,139,250,.45)",
                            borderLeft: "2px solid rgba(167,139,250,.45)",
                          },
                          {
                            bottom: 12,
                            right: 12,
                            borderBottom: "2px solid rgba(167,139,250,.45)",
                            borderRight: "2px solid rgba(167,139,250,.45)",
                          },
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ].map((s: any, i) => (
                          <span
                            key={i}
                            style={{
                              position: "absolute",
                              width: 18,
                              height: 18,
                              ...s,
                            }}
                          />
                        ))}
                        <span style={{ fontSize: 30, opacity: 0.3 }}>👤</span>
                        <p style={{ fontSize: 12, color: "#64748b" }}>
                          Requesting camera…
                        </p>
                      </div>
                    )}

                    {/* Scan-line */}
                    {isDetecting && (
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          height: 2,
                          background:
                            "linear-gradient(90deg,transparent,rgba(167,139,250,.7),transparent)",
                          pointerEvents: "none",
                          animation: "scanLine 1.8s ease-in-out infinite",
                        }}
                      />
                    )}

                    {/* Live badges */}
                    {cameraReady && !isDetectionDone && (
                      <>
                        <div
                          style={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            background: "rgba(5,7,15,.75)",
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255,255,255,.1)",
                            borderRadius: 8,
                            padding: "4px 10px",
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: isDetecting ? "#a78bfa" : "#34d399",
                              display: "inline-block",
                              animation: "blink 1.5s ease-in-out infinite",
                            }}
                          />
                          <span style={{ fontSize: 10, color: "#94a3b8" }}>
                            {isDetecting ? "Scanning face…" : "Face detected"}
                          </span>
                        </div>
                        {isDetecting && (
                          <div
                            style={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              background: "#7c3aed",
                              color: "#fff",
                              fontSize: 9,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              padding: "3px 8px",
                              borderRadius: 20,
                            }}
                          >
                            LIVE
                          </div>
                        )}
                        {modelsLoaded && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: 10,
                              left: 10,
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              background: "rgba(5,7,15,.75)",
                              backdropFilter: "blur(8px)",
                              border: "1px solid rgba(255,255,255,.1)",
                              borderRadius: 8,
                              padding: "4px 10px",
                            }}
                          >
                            <span
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: "50%",
                                background: color,
                                display: "inline-block",
                                animation: "blink 2s ease-in-out infinite",
                              }}
                            />
                            <span
                              style={{
                                fontSize: 11,
                                color: "#e2e8f0",
                                fontWeight: 500,
                              }}
                            >
                              {stressLabel(faceStress)} · {faceStress}%
                            </span>
                          </div>
                        )}
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            backgroundColor: color,
                            transition: "background-color 0.4s ease",
                          }}
                        />
                      </>
                    )}
                  </div>

                  <DetectionStatusBanner
                    detecting={isDetecting}
                    secondsLeft={detectionSecondsLeft}
                    frozenScore={frozenFaceStress}
                  />

                  <div style={{ padding: "12px 16px 0" }}>
                    <ScoreCircle score={effectiveFaceStress} />
                  </div>

                  <div
                    style={{
                      padding: "10px 16px 0",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <MetricBar
                      name="Face Stress"
                      value={modelsLoaded ? effectiveFaceStress : null}
                      active={modelsLoaded}
                    />
                    <MetricBar
                      name="Voice Stress"
                      value={
                        stressData.voiceStress > 0
                          ? stressData.voiceStress
                          : listening
                            ? voiceStress
                            : null
                      }
                      active={listening || stressData.voiceStress > 0}
                    />
                    <MetricBar
                      name="Text Stress"
                      value={
                        stressData.textStress > 0 ? stressData.textStress : null
                      }
                      active={stressData.textStress > 0}
                    />
                  </div>

                  <div style={{ padding: "10px 16px 0" }}>
                    <HistoryGraph history={history} />
                  </div>

                  {modelsLoaded && !isDetectionDone && (
                    <div
                      style={{
                        margin: "10px 16px 0",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: 12,
                        padding: "11px 14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: "#64748b",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        Expression
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#c4b5fd",
                        }}
                      >
                        {stressData.expression || "Neutral"}
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      padding: "10px 16px 16px",
                      marginTop: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {[
                      {
                        icon: "💡",
                        text: "Keep your face well-lit for accurate readings",
                      },
                      {
                        icon: "🎯",
                        text: "Natural speech pace helps voice analysis",
                      },
                      {
                        icon: "🌿",
                        text: "Even 2 minutes can significantly reduce anxiety",
                      },
                    ].map(({ icon, text }) => (
                      <div
                        key={text}
                        style={{
                          display: "flex",
                          gap: 10,
                          background: "rgba(255,255,255,0.025)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 10,
                          padding: "10px 12px",
                        }}
                      >
                        <span style={{ fontSize: 14, flexShrink: 0 }}>
                          {icon}
                        </span>
                        <p
                          style={{
                            fontSize: 12,
                            color: "#94a3b8",
                            lineHeight: 1.6,
                          }}
                        >
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              <DetectionToggle
                open={panelOpen}
                onToggle={() => setPanelOpen(true)}
                detecting={isDetecting}
                faceStress={effectiveFaceStress}
              />
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=Playfair+Display:ital@0;1&display=swap");
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        input::placeholder {
          color: #475569;
        }
        @keyframes floatOrb {
          0%,
          100% {
            opacity: 0.65;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.06);
          }
        }
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 0.85;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        @keyframes scanLine {
          0% {
            top: 0;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        @keyframes tabFadeIn {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(8px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }
      `}</style>
    </>
  );
}
