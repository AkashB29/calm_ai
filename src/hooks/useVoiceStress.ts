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
      alert("Speech recognition is not supported. Please use Chrome.");
      return;
    }

    // Microphone requires a secure origin (https:// or localhost).
    // Plain http:// on an IP address is blocked by browsers.
    const isSecure =
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (!isSecure) {
      alert(
        "Microphone access requires a secure connection.\n\n" +
          "Please open the app at:\n" +
          "• http://localhost:3000  (same machine)\n" +
          "• https://10.148.126.28:3000  (other devices — needs HTTPS setup)",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: any) => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      const confidence = result[0].confidence;

      if (result.isFinal) {
        setTranscript(text);

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

        silenceTimerRef.current = setTimeout(() => {
          recognition.stop();
          onResult(text);
        }, 600);
      }
    };

    recognition.onerror = (event: any) => {
      setListening(false);
      if (event.error === "not-allowed") {
        alert(
          "Microphone access was denied.\n\n" +
            "This usually happens when accessing via http:// on a network IP.\n\n" +
            "Fix: Open the app at http://localhost:3000 instead, or set up HTTPS.",
        );
      } else {
        console.error("Speech recognition error:", event.error);
      }
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
