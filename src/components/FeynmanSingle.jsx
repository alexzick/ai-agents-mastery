import { useState } from "react";
import { btnStyle } from "../styles";
import SpeakButton from "./SpeakButton";
import VoiceInputButton from "./VoiceInputButton";

/**
 * Reusable single-topic Feynman prompt component.
 * Used in both FeynmanMode (list view) and StudyFlowMode (single topic).
 */
export default function FeynmanSingle({
  topic,
  feynmanText,
  setFeynmanText,
  feynmanFeedback,
  setFeynmanFeedback,
  customPrompt,
  onFeedbackReceived,
}) {
  const [loading, setLoading] = useState(false);

  const apiKey = localStorage.getItem("anthropic-api-key") || "";
  const text = feynmanText[topic.id] || "";
  const feedback = feynmanFeedback[topic.id];
  const prompt = customPrompt || topic.feynman;

  const setText = (val) => {
    setFeynmanText((p) => ({ ...p, [topic.id]: val }));
  };

  const callFeedback = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setFeynmanFeedback((p) => ({ ...p, [topic.id]: null }));

    try {
      if (apiKey) {
        const res = await fetch("/api/feynman", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, userText: text, apiKey }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setFeynmanFeedback((p) => ({ ...p, [topic.id]: data }));
        if (onFeedbackReceived) onFeedbackReceived(data);
      } else {
        throw new Error("No API key");
      }
    } catch {
      // Fallback: client-side scoring heuristic
      const wordCount = text.trim().split(/\s+/).length;
      const hasAnalogy = /like|similar|imagine|think of/i.test(text);
      const hasExample = /example|for instance|such as/i.test(text);
      const hasTechnical = /tool|api|loop|memory|prompt|token/i.test(text);
      let score = Math.min(
        10,
        Math.floor(wordCount / 10) +
          (hasAnalogy ? 2 : 0) +
          (hasExample ? 2 : 0) +
          (hasTechnical ? 1 : 0)
      );
      score = Math.max(1, Math.min(10, score));
      const fallback = {
        score,
        understanding:
          wordCount > 30
            ? "Good depth in your explanation."
            : "Try to elaborate more.",
        gap:
          !hasAnalogy && !hasExample
            ? "Try adding an analogy or concrete example."
            : "Consider exploring edge cases or failure modes.",
        hint: "Re-read the topic's details section and try to explain the parts you skipped.",
        encouragement:
          score >= 7
            ? "Strong work — you're building real understanding!"
            : "Keep going — every attempt deepens your knowledge!",
      };
      setFeynmanFeedback((p) => ({ ...p, [topic.id]: fallback }));
      if (onFeedbackReceived) onFeedbackReceived(fallback);
    }
    setLoading(false);
  };

  const handleTranscript = (transcript) => {
    setText((text ? text + " " : "") + transcript);
  };

  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: 20,
        padding: 28,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              color: "#64748b",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 4,
              fontFamily: "'Space Mono', monospace",
            }}
          >
            {topic.category}
          </div>
          <div
            style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0" }}
          >
            {topic.title}
          </div>
        </div>
        {feedback && (
          <div
            style={{
              fontSize: 24,
              fontWeight: 900,
              color:
                feedback.score >= 7
                  ? "#64ffda"
                  : feedback.score >= 4
                  ? "#f59e0b"
                  : "#ef4444",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            {feedback.score}/10
          </div>
        )}
      </div>

      {/* Prompt */}
      <div
        style={{
          padding: "12px 16px",
          background: "#0d1117",
          borderRadius: 10,
          marginBottom: 16,
          borderLeft: "3px solid #64ffda44",
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#64748b",
            marginBottom: 4,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          Your prompt: <SpeakButton text={prompt} />
        </div>
        <div
          style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}
        >
          {prompt}
        </div>
      </div>

      {/* Input area */}
      <div style={{ position: "relative" }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Explain this in your own words, as simply as possible..."
          style={{
            width: "100%",
            minHeight: 120,
            background: "#0d1117",
            border: "1px solid #1e293b",
            borderRadius: 12,
            padding: "14px 50px 14px 16px",
            color: "#e2e8f0",
            fontSize: 14,
            resize: "vertical",
            lineHeight: 1.6,
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 12,
            top: 12,
          }}
        >
          <VoiceInputButton onTranscript={handleTranscript} />
        </div>
      </div>

      {/* Submit */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 12,
        }}
      >
        <button
          onClick={callFeedback}
          disabled={!text.trim() || loading}
          style={{
            ...btnStyle("#64ffda"),
            opacity: !text.trim() ? 0.4 : 1,
          }}
        >
          {loading ? "Analyzing..." : "Get Feedback →"}
        </button>
      </div>

      {/* Feedback display */}
      {feedback && (
        <div style={{ marginTop: 20, display: "grid", gap: 12 }}>
          {[
            {
              icon: "✅",
              label: "What you got right",
              key: "understanding",
              color: "#34d399",
            },
            {
              icon: "🎯",
              label: "Main gap",
              key: "gap",
              color: "#f59e0b",
            },
            {
              icon: "💡",
              label: "Hint",
              key: "hint",
              color: "#60a5fa",
            },
            {
              icon: "🔥",
              label: "",
              key: "encouragement",
              color: "#a78bfa",
            },
          ].map((row) => (
            <div
              key={row.key}
              style={{
                padding: "12px 16px",
                background: row.color + "0d",
                borderRadius: 10,
                borderLeft: `3px solid ${row.color}44`,
              }}
            >
              <span style={{ fontSize: 12, color: row.color }}>
                {row.icon}{" "}
                {row.label && <strong>{row.label}: </strong>}
              </span>
              <span style={{ fontSize: 14, color: "#94a3b8" }}>
                {feedback[row.key]}
              </span>
              <SpeakButton text={feedback[row.key]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
