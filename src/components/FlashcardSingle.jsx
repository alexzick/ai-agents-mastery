import { useState } from "react";
import SpeakButton from "./SpeakButton";

/**
 * Reusable single-flashcard component.
 * Supports bidirectional display (Q→A or A→Q).
 * Optional text answer input with AI judging for approximate match.
 * Used in both FlashcardMode (queue) and StudyFlowMode (single topic).
 */
export default function FlashcardSingle({
  topic,
  direction = "q-to-a",
  onRate,
  onComplete,
}) {
  const [flipped, setFlipped] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [judging, setJudging] = useState(false);
  const [judgment, setJudgment] = useState(null);
  const [showInput, setShowInput] = useState(true);

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
    // Reset state for next card
    setFlipped(false);
    setUserAnswer("");
    setJudgment(null);
    setShowInput(true);
    if (onComplete) onComplete(quality);
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;

    const apiKey = localStorage.getItem("anthropic-api-key");
    if (!apiKey) {
      // No API key — flip the card and let user self-rate
      setFlipped(true);
      return;
    }

    setJudging(true);
    try {
      const res = await fetch("/api/judge-flashcard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: frontText,
          correctAnswer: backText,
          userAnswer: userAnswer.trim(),
          apiKey,
        }),
      });
      const data = await res.json();
      if (data.error) {
        console.error("Judge error:", data.error);
        setFlipped(true);
      } else {
        setJudgment(data);
        setFlipped(true);
      }
    } catch (err) {
      console.error("Judge fetch error:", err);
      setFlipped(true);
    } finally {
      setJudging(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmitAnswer();
    }
  };

  const matchColors = {
    exact: "#64ffda",
    close: "#22c55e",
    partial: "#f59e0b",
    wrong: "#ef4444",
  };

  const matchLabels = {
    exact: "✓ Exact Match",
    close: "✓ Close Match",
    partial: "~ Partial Match",
    wrong: "✗ Not Quite",
  };

  return (
    <div>
      {/* Card */}
      <div
        onClick={() => {
          if (!flipped && !showInput) setFlipped(true);
        }}
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 24,
          padding: 48,
          minHeight: 280,
          cursor: flipped || showInput ? "default" : "pointer",
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

            {/* Answer input area */}
            {showInput && (
              <div style={{ marginTop: 28 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 8,
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  YOUR ANSWER (optional)
                </div>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer here... or skip and flip"
                  disabled={judging}
                  style={{
                    width: "100%",
                    minHeight: 80,
                    background: "#020817",
                    border: "1px solid #1e293b",
                    borderRadius: 12,
                    padding: 16,
                    color: "#e2e8f0",
                    fontSize: 15,
                    lineHeight: 1.6,
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    marginTop: 12,
                    justifyContent: "center",
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubmitAnswer();
                    }}
                    disabled={judging || !userAnswer.trim()}
                    style={{
                      padding: "10px 24px",
                      borderRadius: 12,
                      border: "1px solid #64ffda44",
                      background: judging
                        ? "#64ffda11"
                        : userAnswer.trim()
                        ? "#64ffda22"
                        : "#64ffda08",
                      color: userAnswer.trim() ? "#64ffda" : "#334155",
                      cursor:
                        judging || !userAnswer.trim()
                          ? "not-allowed"
                          : "pointer",
                      fontSize: 14,
                      fontWeight: 600,
                      transition: "all 0.15s",
                    }}
                  >
                    {judging ? "⏳ Judging..." : "Submit Answer"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFlipped(true);
                    }}
                    disabled={judging}
                    style={{
                      padding: "10px 24px",
                      borderRadius: 12,
                      border: "1px solid #1e293b",
                      background: "transparent",
                      color: "#64748b",
                      cursor: judging ? "not-allowed" : "pointer",
                      fontSize: 14,
                      fontWeight: 500,
                      transition: "all 0.15s",
                    }}
                  >
                    Skip & Flip
                  </button>
                </div>
              </div>
            )}

            {!showInput && (
              <div style={{ marginTop: 32, fontSize: 12, color: "#334155" }}>
                tap to reveal {backLabel.toLowerCase()}
              </div>
            )}
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

            {/* Show user's answer if they submitted one */}
            {userAnswer.trim() && (
              <div
                style={{
                  marginTop: 20,
                  padding: "16px 20px",
                  background: "#020817",
                  borderRadius: 12,
                  borderLeft: `3px solid ${
                    judgment ? matchColors[judgment.match] || "#64748b" : "#64748b"
                  }`,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    letterSpacing: 1,
                    marginBottom: 6,
                    textTransform: "uppercase",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Your Answer</span>
                  {judgment && (
                    <span
                      style={{
                        color: matchColors[judgment.match] || "#64748b",
                        fontWeight: 700,
                        fontSize: 12,
                        letterSpacing: 0,
                      }}
                    >
                      {matchLabels[judgment.match] || judgment.match}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "#94a3b8",
                    lineHeight: 1.6,
                  }}
                >
                  {userAnswer}
                </div>
                {judgment?.feedback && (
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 13,
                      color: matchColors[judgment.match] || "#64748b",
                      fontStyle: "italic",
                      lineHeight: 1.5,
                    }}
                  >
                    {judgment.feedback}
                  </div>
                )}
              </div>
            )}

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
          {/* If AI judged, show suggested rating */}
          {judgment && (
            <div
              style={{
                textAlign: "center",
                marginBottom: 16,
                padding: "12px 20px",
                background:
                  matchColors[judgment.match] + "11",
                border: `1px solid ${matchColors[judgment.match]}33`,
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: matchColors[judgment.match],
                  fontWeight: 700,
                }}
              >
                AI suggests:{" "}
                {judgment.score >= 5
                  ? "Perfect"
                  : judgment.score >= 4
                  ? "Good"
                  : judgment.score >= 3
                  ? "Good"
                  : judgment.score >= 2
                  ? "Hard"
                  : "Blackout"}{" "}
                (score: {judgment.score}/5)
              </div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>
                You can accept or override below
              </div>
            </div>
          )}

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
            {judgment ? "Accept or rate yourself:" : "How well did you know this?"}
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* If AI judged, show an "Accept AI" button first */}
            {judgment && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRate(judgment.score);
                }}
                style={{
                  padding: "12px 24px",
                  borderRadius: 12,
                  border: `2px solid ${matchColors[judgment.match]}`,
                  background: matchColors[judgment.match] + "22",
                  color: matchColors[judgment.match],
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 700,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    matchColors[judgment.match] + "33")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    matchColors[judgment.match] + "22")
                }
              >
                ✓ Accept ({judgment.score}/5)
              </button>
            )}
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
