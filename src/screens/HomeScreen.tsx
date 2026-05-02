"use client";
import { useState } from "react";
import { Mic } from "lucide-react";

export default function HomeScreen({
  onVoiceInput,
  onTextInput,
  faceStress,
  listening,
}: any) {
  const [text, setText] = useState("");

  const stressLabel =
    faceStress >= 70 ? "Critical" : faceStress >= 40 ? "High" : "Calm";

  return (
    <div className="w-full min-h-[calc(100vh-120px)] flex items-center justify-center px-5 py-8">
      {/* CENTER CONTAINER */}
      <div className="w-full max-w-lg flex flex-col items-center text-center gap-6">
        {/* STRESS INDICATOR */}
        <div className="px-4 py-2 w-40 rounded-full bg-white/5 border border-white/10">
          <span className="text-xs  text-gray-400 uppercase tracking-widest">
            Stress:{" "}
          </span>
          <span className="text-xs text-white font-medium ml-1">
            {faceStress}% • {stressLabel}
          </span>
        </div>

        {/* TITLE */}
        <h1 className="text-3xl sm:text-4xl font-semibold text-white leading-tight">
          What's happening?
        </h1>

        {/* SUBTEXT */}
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-md">
          Describe your situation clearly. I'll guide you step-by-step to handle
          it.
        </p>

        {/* INPUT AREA */}
        <div className="w-full flex flex-col gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="       Example: My father collapsed and is not responding..."
            className=" w-full h-32 rounded-2xl bg-[#111] border border-white/10 p-5 text-white outline-none resize-none leading-relaxed
            focus:border-white/30 transition-all placeholder:text-gray-600"
          />

          {/* PRIMARY BUTTON */}
          <button
            disabled={!text.trim()}
            onClick={() => onTextInput(text, "text")}
            className={`w-full py-4 px-2 rounded-2xl h-8 text-base font-semibold transition-all
            ${
              text.trim()
                ? "bg-white text-black shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                : "bg-white/10 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue →
          </button>
        </div>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            or
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* VOICE BUTTON */}
        <button
          onClick={onVoiceInput}
          className={`flex items-center gap-1 w-40 h-10 p-10 rounded-full text-base font-medium transition-all
          ${
            listening
              ? "bg-red-500 text-white animate-pulse shadow-lg"
              : "bg-white/10 text-white hover:bg-white/20 active:scale-[0.98]"
          }`}
        >
          <div className="flex items-center w-full justify-center gap-1">
            <Mic size={18} />
            {listening ? "Listening..." : "Speak instead"}
          </div>
        </button>
      </div>
    </div>
  );
}
