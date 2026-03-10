import { useEffect } from "react";
import { useSTT } from "../hooks/useSTT";

export default function VoiceInputButton({ onTranscript }) {
  const { startListening, stopListening, transcript, isListening, isSupported } = useSTT();

  // When transcript updates and we stop listening, call onTranscript
  useEffect(() => {
    if (!isListening && transcript) {
      onTranscript(transcript);
    }
  }, [isListening, transcript]);

  if (!isSupported) return null;

  return (
    <button
      onClick={() => isListening ? stopListening() : startListening()}
      title={isListening ? "Stop recording" : "Record voice"}
      style={{
        width: 32, height: 32,
        borderRadius: "50%",
        border: isListening ? "2px solid #ef4444" : "1px solid #64ffda33",
        background: isListening ? "#ef444422" : "#64ffda11",
        color: isListening ? "#ef4444" : "#64ffda",
        cursor: "pointer",
        fontSize: 16,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s",
        animation: isListening ? "pulse-ring 1.5s infinite" : "none",
        padding: 0,
        flexShrink: 0,
      }}
    >
      🎙️
    </button>
  );
}
