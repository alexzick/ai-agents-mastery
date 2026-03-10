import { useState } from "react";
import TOPICS, { CATEGORIES } from "../data/topics";
import { btnStyle } from "../styles";

export default function FeynmanMode({
  setMode,
  feynmanText,
  setFeynmanText,
  feynmanFeedback,
  setFeynmanFeedback,
}) {
  const [loading, setLoading] = useState({});
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("anthropic-api-key") || ""
  );
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTopics =
    selectedCategory === "All"
      ? TOPICS
      : TOPICS.filter((t) => t.category === selectedCategory);

  const callFeynmanFeedback = async (topicId, prompt, userText) => {
    if (!apiKey) {
      setShowKeyInput(true);
      return;
    }
    setLoading((p) => ({ ...p, [topicId]: true }));
    setFeynmanFeedback((p) => ({ ...p, [topicId]: null }));
    try {
      const res = await fetch("/api/feynman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, userText, apiKey }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFeynmanFeedback((p) => ({ ...p, [topicId]: data }));
    } catch (e) {
      // Fallback: client-side scoring heuristic
      const wordCount = userText.trim().split(/\s+/).length;
      const hasAnalogy = /like|similar|imagine|think of/i.test(userText);
      const hasExample = /example|for instance|such as/i.test(userText);
      const hasTechnical = /tool|api|loop|memory|prompt|token/i.test(userText);
      let score = Math.min(
        10,
        Math.floor(wordCount / 10) + (hasAnalogy ? 2 : 0) + (hasExample ? 2 : 0) + (hasTechnical ? 1 : 0)
      );
      score = Math.max(1, Math.min(10, score));
      setFeynmanFeedback((p) => ({
        ...p,
        [topicId]: {
          score,
          understanding:
            wordCount > 30
              ? "Good depth in your explanation."
              : "Try to elaborate more.",
          gap:
            !hasAnalogy && !hasExample
              ? "Try adding an analogy or concrete example to strengthen your explanation."
              : "Consider exploring edge cases or failure modes.",
          hint: "Re-read the topic's details section and try to explain the parts you skipped.",
          encouragement:
            score >= 7
              ? "Strong work — you're building real understanding!"
              : "Keep going — every attempt deepens your knowledge!",
        },
      }));
    }
    setLoading((p) => ({ ...p, [topicId]: false }));
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <button
          onClick={() => setMode("home")}
          style={{
            color: "#64748b",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          ← Back
        </button>
        <h2
          style={{
            margin: 0,
            color: "#e2e8f0",
            fontSize: 22,
            fontWeight: 800,
          }}
        >
          Feynman Lab
        </h2>
        <div
          style={{
            fontSize: 11,
            color: "#64ffda",
            fontFamily: "'Space Mono', monospace",
            padding: "4px 12px",
            border: "1px solid #64ffda33",
            borderRadius: 100,
          }}
        >
          ACTIVE RECALL
        </div>
      </div>

      <p
        style={{
          color: "#64748b",
          marginBottom: 16,
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        The Feynman Technique: explain a concept in simple terms as if teaching
        a curious beginner. Where you struggle to explain, that's where the gap
        is.
      </p>

      {/* Category filter */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "6px 14px",
              borderRadius: 100,
              border: "1px solid",
              borderColor:
                selectedCategory === cat ? "#64ffda" : "#1e293b",
              background:
                selectedCategory === cat ? "#64ffda15" : "transparent",
              color: selectedCategory === cat ? "#64ffda" : "#64748b",
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "'Space Mono', monospace",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* API key input for AI feedback */}
      {showKeyInput && (
        <div
          style={{
            background: "#0f172a",
            border: "1px solid #f59e0b33",
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <div
            style={{ fontSize: 14, color: "#f59e0b", marginBottom: 8 }}
          >
            To get AI-powered feedback, add your Anthropic API key:
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              style={{
                flex: 1,
                background: "#0d1117",
                border: "1px solid #1e293b",
                borderRadius: 8,
                padding: "8px 12px",
                color: "#e2e8f0",
                fontSize: 14,
              }}
            />
            <button
              onClick={() => {
                localStorage.setItem("anthropic-api-key", apiKey);
                setShowKeyInput(false);
              }}
              style={btnStyle("#64ffda")}
            >
              Save
            </button>
          </div>
          <div
            style={{ fontSize: 11, color: "#475569", marginTop: 8 }}
          >
            Key is stored in your browser only. Without a key, you'll
            get heuristic-based feedback instead.
          </div>
        </div>
      )}

      <div
        style={{
          fontSize: 12,
          color: "#475569",
          marginBottom: 16,
          fontFamily: "'Space Mono', monospace",
        }}
      >
        Showing {filteredTopics.length} of {TOPICS.length} topics
      </div>

      <div style={{ display: "grid", gap: 24 }}>
        {filteredTopics.map((t) => (
          <div
            key={t.id}
            style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 20,
              padding: 28,
            }}
          >
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
                  {t.category}
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#e2e8f0",
                  }}
                >
                  {t.title}
                </div>
              </div>
              {feynmanFeedback[t.id] && (
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color:
                      feynmanFeedback[t.id].score >= 7
                        ? "#64ffda"
                        : feynmanFeedback[t.id].score >= 4
                        ? "#f59e0b"
                        : "#ef4444",
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  {feynmanFeedback[t.id].score}/10
                </div>
              )}
            </div>

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
                }}
              >
                Your prompt:
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#94a3b8",
                  lineHeight: 1.6,
                }}
              >
                {t.feynman}
              </div>
            </div>

            <textarea
              value={feynmanText[t.id] || ""}
              onChange={(e) =>
                setFeynmanText((p) => ({
                  ...p,
                  [t.id]: e.target.value,
                }))
              }
              placeholder="Explain this in your own words, as simply as possible..."
              style={{
                width: "100%",
                minHeight: 120,
                background: "#0d1117",
                border: "1px solid #1e293b",
                borderRadius: 12,
                padding: "14px 16px",
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
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 12,
              }}
            >
              <button
                onClick={() =>
                  callFeynmanFeedback(
                    t.id,
                    t.feynman,
                    feynmanText[t.id] || ""
                  )
                }
                disabled={!feynmanText[t.id] || loading[t.id]}
                style={{
                  ...btnStyle("#64ffda"),
                  opacity: !feynmanText[t.id] ? 0.4 : 1,
                }}
              >
                {loading[t.id] ? "Analyzing..." : "Get Feedback →"}
              </button>
            </div>

            {feynmanFeedback[t.id] && (
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
                      {feynmanFeedback[t.id][row.key]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
