import { useState } from "react";
import SpeakButton from "./SpeakButton";

/**
 * Reusable single-flashcard component.
 * Supports bidirectional display (Q→A or A→Q).
 * Used in both FlashcardMode (queue) and StudyFlowMode (single topic).
 */
export default function FlashcardSingle({
  topic,
  direction = "q-to-a",
  onRate,
  onComplete,
}) {
  const [flipped, setFlipped] = useState(false);

  if (!topic) return null;

  const isQtoA = direction === "q-to-a";
  const frontText = isQtoA ? topic.flashQ : topic.flashA;
  const backText = isQtoA ? topic.flashA : topic.flashQ;
  const frontLabel = isQtoA ? "QUESTION" : "ANSWER";
  const backLabel = isQtoA ? "ANSWER" : "QUESTION";
  const frontPrefix = isQtoA ? "Q:" : "A:";
  const backPrefix = isQtoA ? "A:" : "Q:";

  const handleRate = (quality) => {
    if (onRate) onRate(topic.id, quality);
    setFlipped(false);
    if (onComplete) onComplete(quality);
  };

  return (
    <div>
      {/* Card */}
      <div
        onClick={() => setFlipped((f) => !f)}
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 24,
          padding: 48,
          minHeight: 280,
          cursor: "pointer",
          transition: "all 0.3s",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#334155")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e293b")}
      >
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 24,
            fontSize: 11,
            color: "#64748b",
            letterSpacing: 2,
            textTransform: "uppercase",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          {topic.category}
        </div>
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 24,
            fontSize: 11,
            color: "#334155",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          {flipped ? backLabel : frontLabel}
        </div>

        {!flipped ? (
          <div>
            <div
              style={{
                fontSize: 13,
                color: "#64ffda",
                marginBottom: 16,
                fontFamily: "'Space Mono', monospace",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {frontPrefix}
              <SpeakButton text={frontText} />
            </div>
            <div
              style={{
                fontSize: 20,
                color: "#e2e8f0",
                lineHeight: 1.5,
                fontWeight: 600,
              }}
            >
              {frontText}
            </div>
            <div style={{ marginTop: 32, fontSize: 12, color: "#334155" }}>
              tap to reveal {backLabel.toLowerCase()}
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                fontSize: 13,
                color: "#a78bfa",
                marginBottom: 16,
                fontFamily: "'Space Mono', monospace",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {backPrefix}
              <SpeakButton text={backText} />
            </div>
            <div
              style={{
                fontSize: 18,
                color: "#e2e8f0",
                lineHeight: 1.6,
              }}
            >
              {backText}
            </div>
            <div
              style={{
                marginTop: 24,
                padding: "16px 20px",
                background: "#0d1117",
                borderRadius: 12,
                borderLeft: "3px solid #64ffda",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#64748b",
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Analogy
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "#94a3b8",
                  lineHeight: 1.6,
                }}
              >
                {topic.analogy}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rating buttons */}
      {flipped && (
        <div style={{ marginTop: 24 }}>
          <div
            style={{
              fontSize: 12,
              color: "#64748b",
              textAlign: "center",
              marginBottom: 16,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            How well did you know this?
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              { q: 0, label: "Blackout", color: "#ef4444" },
              { q: 2, label: "Hard", color: "#f59e0b" },
              { q: 3, label: "Good", color: "#3b82f6" },
              { q: 5, label: "Perfect", color: "#64ffda" },
            ].map((r) => (
              <button
                key={r.q}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRate(r.q);
                }}
                style={{
                  padding: "12px 20px",
                  borderRadius: 12,
                  border: `1px solid ${r.color}33`,
                  background: r.color + "11",
                  color: r.color,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = r.color + "22")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = r.color + "11")
                }
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Direction toggle component for switching between Q→A and A→Q.
 */
export function DirectionToggle({ direction, setDirection }) {
  const options = [
    { value: "q-to-a", label: "Q → A" },
    { value: "a-to-q", label: "A → Q" },
  ];

  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setDirection(opt.value)}
          style={{
            padding: "6px 16px",
            borderRadius: 100,
            border: `1px solid ${
              direction === opt.value ? "#64ffda" : "#1e293b"
            }`,
            background:
              direction === opt.value ? "#64ffda15" : "transparent",
            color: direction === opt.value ? "#64ffda" : "#475569",
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "'Space Mono', monospace",
            fontWeight: 600,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
