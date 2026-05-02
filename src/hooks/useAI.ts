import { useState } from "react";
import { StressData, CrisisResponse } from "@/types";

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CrisisResponse | null>(null);

  const getAIResponse = async (
    userText: string,
    stressData: StressData,
  ): Promise<CrisisResponse | null> => {
    setLoading(true);

    const prompt = `
You are CalmAI — an emergency guide for Indian citizens.

User said: "${userText}"

Stress Detection:
- Combined stress: ${stressData.combined}/100
- Level: ${stressData.level.toUpperCase()}
- Face stress: ${stressData.faceStress}/100
- Expression: ${stressData.expression}

Rules:
- If stress above 70: max 5 words per action, very simple language
- Set needsBreathing true if stress above 80
- Medical emergency: set emergencyCall to "108"
- EPF or government: link to real government portal
- Always be calm and reassuring

Return ONLY this JSON, nothing else:
{
  "scenario": "medical or financial or documents or travel or general",
  "calming": "One short calming sentence",
  "needsBreathing": false,
  "emergencyCall": null,
  "steps": [
    {
      "step": 1,
      "action": "Short action under 6 words",
      "detail": "One sentence explanation",
      "duration": "Time estimate",
      "link": "url or null",
      "linkLabel": "Button text or null"
    }
  ]
}`;

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const clean = data.text.replace(/```json|```/g, "").trim();
      const parsed: CrisisResponse = JSON.parse(clean);
      setResponse(parsed);
      return parsed;
    } catch (err) {
      console.error("AI error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, response, getAIResponse };
};
