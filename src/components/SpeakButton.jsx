import { useTTS } from "../hooks/useTTS";

export default function SpeakButton({ text }) {
  const { speak, stop, isSpeaking, isAvailable } = useTTS();
  if (!isAvailable) return null; // graceful degradation

  return (
    <button
      onClick={() => isSpeaking ? stop() : speak(text)}
      title={isSpeaking ? "Stop" : "Listen"}
      style={{
        width: 28, height: 28,
        borderRadius: "50%",
        border: isSpeaking ? "1px solid #ef444466" : "1px solid #64ffda33",
        background: isSpeaking ? "#ef444411" : "#64ffda11",
        color: isSpeaking ? "#ef4444" : "#64ffda",
        cursor: "pointer",
        fontSize: 14,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s",
        verticalAlign: "middle",
        marginLeft: 8,
        padding: 0,
        flexShrink: 0,
      }}
    >
      {isSpeaking ? "⏹" : "🔊"}
    </button>
  );
}
