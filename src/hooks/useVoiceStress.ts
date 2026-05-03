import { useState, useRef } from "react";

export const useVoiceStress = () => {
  const [voiceStress, setVoiceStress] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startListening = (onResult: (text: string) => void) => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Please use Chrome browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: any) => {
      // Clear previous silence timer on every new word
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      const confidence = result[0].confidence;

      if (result.isFinal) {
        setTranscript(text);

        // Stress: filler words + low confidence + word count speed
        const lc = text.toLowerCase();
        const fillers = ["um", "uh", "like", "i mean", "you know"];
        const fillerCount = fillers.reduce(
          (n, f) => n + (lc.split(f).length - 1),
          0,
        );
        const wordCount = text.trim().split(/\s+/).length;
        const speedScore = Math.min(wordCount * 5, 40);
        const fillerScore = Math.min(fillerCount * 10, 30);
        const confidenceScore = confidence
          ? Math.round((1 - confidence) * 30)
          : 15;
        const stress = Math.min(
          speedScore + fillerScore + confidenceScore,
          100,
        );
        setVoiceStress(stress);

        // Fire after 600ms of silence — feels instant but won't cut mid-sentence
        silenceTimerRef.current = setTimeout(() => {
          recognition.stop();
          onResult(text);
        }, 600);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    recognitionRef.current?.stop();
    setListening(false);
  };

  return { voiceStress, transcript, listening, startListening, stopListening };
};
