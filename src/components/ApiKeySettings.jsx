import { useState } from "react";

export default function ApiKeySettings({ onClose }) {
  const [anthropicKey, setAnthropicKey] = useState(
    localStorage.getItem("anthropic-api-key") || ""
  );
  const [elevenLabsKey, setElevenLabsKey] = useState(
    localStorage.getItem("elevenlabs-api-key") || ""
  );
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (anthropicKey) localStorage.setItem("anthropic-api-key", anthropicKey);
    else localStorage.removeItem("anthropic-api-key");
    if (elevenLabsKey) localStorage.setItem("elevenlabs-api-key", elevenLabsKey);
    else localStorage.removeItem("elevenlabs-api-key");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #1e293b",
    background: "#0d1117",
    color: "#e2e8f0",
    fontSize: 13,
    fontFamily: "'Space Mono', monospace",
  };

  const labelStyle = {
    fontSize: 11,
    color: "#94a3b8",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontFamily: "'Space Mono', monospace",
    marginBottom: 6,
    display: "block",
  };

  return (
    <div style={{
      background: "#0f172a",
      borderRadius: 16,
      border: "1px solid #1e293b",
      padding: 24,
      marginBottom: 24,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 11, color: "#64ffda", letterSpacing: 3, fontFamily: "'Space Mono', monospace", textTransform: "uppercase" }}>
          API KEYS
        </span>
        {onClose && (
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 18 }}>✕</button>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Anthropic API Key (for AI feedback)</label>
        <input
          type="password"
          value={anthropicKey}
          onChange={(e) => setAnthropicKey(e.target.value)}
          placeholder="sk-ant-..."
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>ElevenLabs API Key (for text-to-speech)</label>
        <input
          type="password"
          value={elevenLabsKey}
          onChange={(e) => setElevenLabsKey(e.target.value)}
          placeholder="xi-..."
          style={inputStyle}
        />
      </div>

      <button
        onClick={save}
        style={{
          padding: "10px 24px",
          borderRadius: 10,
          border: "1px solid #64ffda44",
          background: saved ? "#22c55e22" : "#64ffda11",
          color: saved ? "#22c55e" : "#64ffda",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "inherit",
          transition: "all 0.15s",
          width: "100%",
        }}
      >
        {saved ? "✓ Saved" : "Save Keys"}
      </button>

      <p style={{ fontSize: 11, color: "#475569", marginTop: 12, lineHeight: 1.5 }}>
        Keys are stored locally in your browser. Never sent anywhere except to their respective APIs.
      </p>
    </div>
  );
}
