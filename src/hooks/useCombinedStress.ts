import { StressData } from "@/types";
import { STRESS_THRESHOLDS } from "@/config/api";

type InputMode = "voice" | "text" | "button";

export const useCombinedStress = () => {
  const getCombinedStress = (
    faceStress: number,
    voiceStress: number,
    textStress: number,
    inputMode: InputMode,
  ): StressData => {
    // ----------- WEIGHTS CONFIG -----------
    const WEIGHTS = {
      voice: { face: 0.4, voice: 0.6, text: 0 },
      text: { face: 0.5, voice: 0, text: 0.5 },
      button: { face: 1, voice: 0, text: 0 },
    };

    const weight = WEIGHTS[inputMode];

    // ----------- COMBINED SCORE -----------
    const combined = Math.round(
      faceStress * weight.face +
        voiceStress * weight.voice +
        textStress * weight.text,
    );

    // ----------- LEVEL CLASSIFICATION -----------
    let level: "critical" | "high" | "normal" = "normal";

    if (combined >= STRESS_THRESHOLDS.CRITICAL) {
      level = "critical";
    } else if (combined >= STRESS_THRESHOLDS.HIGH) {
      level = "high";
    }

    // ----------- EXPRESSION DETECTION -----------
    const expression = getExpression(faceStress);

    return {
      faceStress,
      voiceStress,
      textStress,
      combined,
      level,
      expression,
    };
  };

  // ----------- HELPER: EXPRESSION -----------
  const getExpression = (faceStress: number): string => {
    if (faceStress >= 80) return "Panic";
    if (faceStress >= 60) return "Fear";
    if (faceStress >= 40) return "Worried";
    if (faceStress >= 20) return "Uneasy";
    return "Neutral";
  };

  return { getCombinedStress };
};
