import { useState, useRef } from "react";

export const useVoiceStress = () => {
  const [voiceStress, setVoiceStress] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

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
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      const wordCount = text.split(" ").length;
      const speedScore = Math.min(wordCount * 8, 100);
      const stress = Math.round((1 - confidence) * 50 + speedScore * 0.5);
      setVoiceStress(Math.min(stress + 30, 100));
      setTranscript(text);
      onResult(text);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return { voiceStress, transcript, listening, startListening, stopListening };
};
