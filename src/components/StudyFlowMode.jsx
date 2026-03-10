import { useState } from "react";
import TOPICS from "../data/topics";
import { btnStyle } from "../styles";
import { getRetention, getMastery, getMasteryColor } from "../utils/forgetting";
import FeynmanSingle from "./FeynmanSingle";
import FlashcardSingle, { DirectionToggle } from "./FlashcardSingle";
import SpeakButton from "./SpeakButton";

const STEPS = [
  { key: "read", label: "Read", icon: "📖" },
  { key: "explain", label: "Explain", icon: "🧠" },
  { key: "recall", label: "Recall", icon: "⚡" },
  { key: "results", label: "Done", icon: "✅" },
];

export default function StudyFlowMode({
  topicId,
  setMode,
  feynmanText,
  setFeynmanText,
  feynmanFeedback,
  setFeynmanFeedback,
  rateCard,
  topicMastery,
  updateMastery,
}) {
  const [step, setStep] = useState("read");
  const [direction, setDirection] = useState("q-to-a");
  const [flashResult, setFlashResult] = useState(null);
  const [prevMastery, setPrevMastery] = useState(null);

  const topic = TOPICS.find((t) => t.id === topicId);
  if (!topic) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <p style={{ color: "#ef4444" }}>Topic not found.</p>
        <button onClick={() => setMode("home")} style={btnStyle("#64ffda")}>
          Go Home
        </button>
      </div>
    );
  }

  const masteryData = topicMastery[topicId] || {};
  const currentMastery = getMastery(masteryData);
  const stepIdx = STEPS.findIndex((s) => s.key === step);

  const startExplain = () => {
    setPrevMastery(currentMastery);
    setStep("explain");
  };

  const handleFeynmanFeedback = (feedback) => {
    // Update mastery with Feynman score
    if (updateMastery && feedback?.score) {
      updateMastery(topicId, "feynman", feedback.score);
    }
  };

  const handleFlashcardRate = (id, quality) => {
    rateCard(id, quality);
    setFlashResult({ quality, correct: quality >= 3 });
    if (updateMastery) {
      updateMastery(topicId, "flashcard", quality);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        <button
          onClick={() => setMode("browse")}
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
          GUIDED STUDY
        </div>
      </div>

      {/* Step Progress */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 0,
          marginBottom: 40,
        }}
      >
        {STEPS.map((s, i) => (
          <div
            key={s.key}
            style={{ display: "flex", alignItems: "center" }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  border: `2px solid ${
                    i < stepIdx
                      ? "#64ffda"
                      : i === stepIdx
                      ? "#64ffda"
                      : "#334155"
                  }`,
                  background:
                    i < stepIdx
                      ? "#64ffda22"
                      : i === stepIdx
                      ? "#64ffda11"
                      : "transparent",
                  color: i <= stepIdx ? "#64ffda" : "#475569",
                  transition: "all 0.3s",
                }}
              >
                {i < stepIdx ? "✓" : s.icon}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: i <= stepIdx ? "#64ffda" : "#475569",
                  marginTop: 4,
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {s.label}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  width: 48,
                  height: 2,
                  background: i < stepIdx ? "#64ffda44" : "#1e293b",
                  margin: "0 4px",
                  marginBottom: 16,
                  transition: "all 0.3s",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === "read" && (
        <ReadStep topic={topic} onContinue={startExplain} />
      )}

      {step === "explain" && (
        <div>
          <div
            style={{
              textAlign: "center",
              marginBottom: 24,
              padding: "16px 20px",
              background: "#0d1117",
              borderRadius: 12,
              border: "1px solid #f59e0b33",
            }}
          >
            <div style={{ fontSize: 14, color: "#f59e0b", fontWeight: 600 }}>
              📕 Close the book — explain from memory
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
              Don't look back at the material. Where you struggle is where the gap is.
            </div>
          </div>
          <FeynmanSingle
            topic={topic}
            feynmanText={feynmanText}
            setFeynmanText={setFeynmanText}
            feynmanFeedback={feynmanFeedback}
            setFeynmanFeedback={setFeynmanFeedback}
            customPrompt={`Without looking back, explain "${topic.title}" in your own words. What is it, why does it matter, and how does it connect to building AI agents?`}
            onFeedbackReceived={handleFeynmanFeedback}
          />
          {feynmanFeedback[topicId] && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button
                onClick={() => setStep("recall")}
                style={btnStyle("#64ffda")}
              >
                Continue to Flashcards →
              </button>
            </div>
          )}
        </div>
      )}

      {step === "recall" && (
        <div>
          <div style={{ marginBottom: 20 }}>
            <DirectionToggle direction={direction} setDirection={setDirection} />
          </div>
          <FlashcardSingle
            topic={topic}
            direction={direction}
            onRate={handleFlashcardRate}
            onComplete={() => setStep("results")}
          />
        </div>
      )}

      {step === "results" && (
        <ResultsStep
          topic={topic}
          feynmanFeedback={feynmanFeedback[topicId]}
          flashResult={flashResult}
          prevMastery={prevMastery}
          currentMastery={getMastery(topicMastery[topicId] || {})}
          topicMastery={topicMastery[topicId] || {}}
          setMode={setMode}
        />
      )}
    </div>
  );
}

function ReadStep({ topic, onContinue }) {
  return (
    <div>
      <div
        style={{
          marginBottom: 8,
          fontSize: 11,
          color: "#64748b",
          letterSpacing: 3,
          textTransform: "uppercase",
          fontFamily: "'Space Mono', monospace",
        }}
      >
        {topic.category} · Topic {topic.order}
      </div>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 900,
          color: "#e2e8f0",
          marginBottom: 24,
          marginTop: 0,
        }}
      >
        {topic.title}
      </h1>

      {/* Core */}
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 16,
          padding: 24,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#64ffda",
            letterSpacing: 2,
            marginBottom: 8,
            fontFamily: "'Space Mono', monospace",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          CORE CONCEPT <SpeakButton text={topic.core} />
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#e2e8f0",
            lineHeight: 1.7,
            fontWeight: 600,
          }}
        >
          {topic.core}
        </div>
      </div>

      {/* Analogy */}
      <div
        style={{
          background: "#0d1117",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
          borderLeft: "3px solid #a78bfa",
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#a78bfa",
            marginBottom: 6,
            letterSpacing: 2,
            fontFamily: "'Space Mono', monospace",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          ANALOGY <SpeakButton text={topic.analogy} />
        </div>
        <div
          style={{
            fontSize: 14,
            color: "#94a3b8",
            lineHeight: 1.7,
            fontStyle: "italic",
          }}
        >
          {topic.analogy}
        </div>
      </div>

      {/* Details */}
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 16,
          padding: 24,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#64748b",
            letterSpacing: 2,
            marginBottom: 12,
            fontFamily: "'Space Mono', monospace",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          DETAILS <SpeakButton text={topic.details?.replace(/[*#`]/g, "")} />
        </div>
        <pre
          style={{
            fontSize: 14,
            color: "#94a3b8",
            lineHeight: 1.7,
            whiteSpace: "pre-wrap",
            fontFamily: "inherit",
            margin: 0,
          }}
        >
          {topic.details}
        </pre>
      </div>

      <div style={{ textAlign: "center" }}>
        <button onClick={onContinue} style={btnStyle("#64ffda")}>
          I've studied this — Test me →
        </button>
      </div>
    </div>
  );
}

function ResultsStep({
  topic,
  feynmanFeedback,
  flashResult,
  prevMastery,
  currentMastery,
  topicMastery,
  setMode,
}) {
  const feynmanScore = feynmanFeedback?.score || 0;
  const retention = getRetention(topicMastery);
  const stabilityDays = (topicMastery.stability || 1).toFixed(1);
  const masteryPct = Math.round(currentMastery * 100);
  const prevPct = prevMastery !== null ? Math.round(prevMastery * 100) : null;
  const masteryDelta = prevPct !== null ? masteryPct - prevPct : null;

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>✅</div>
        <h2 style={{ color: "#e2e8f0", margin: 0, fontSize: 24 }}>
          Study Session Complete
        </h2>
        <p style={{ color: "#64748b", fontSize: 14 }}>{topic.title}</p>
      </div>

      <div style={{ display: "grid", gap: 16, marginBottom: 32 }}>
        {/* Feynman score */}
        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 16,
            padding: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
              🧠 Feynman Explanation
            </div>
            <div style={{ fontSize: 14, color: "#94a3b8" }}>
              {feynmanScore >= 7
                ? "Strong understanding"
                : feynmanScore >= 4
                ? "Partial understanding"
                : "Needs more work"}
            </div>
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              color:
                feynmanScore >= 7
                  ? "#64ffda"
                  : feynmanScore >= 4
                  ? "#f59e0b"
                  : "#ef4444",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            {feynmanScore}/10
          </div>
        </div>

        {/* Flashcard result */}
        {flashResult && (
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 16,
              padding: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
                ⚡ Flashcard Recall
              </div>
              <div style={{ fontSize: 14, color: "#94a3b8" }}>
                {flashResult.correct ? "Correct" : "Incorrect"} —{" "}
                {
                  ["Blackout", "", "Hard", "Good", "", "Perfect"][
                    flashResult.quality
                  ]
                }
              </div>
            </div>
            <div
              style={{
                fontSize: 28,
                color: flashResult.correct ? "#64ffda" : "#ef4444",
              }}
            >
              {flashResult.correct ? "✓" : "✗"}
            </div>
          </div>
        )}

        {/* Mastery update */}
        <div
          style={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>
            📊 Mastery Update
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 14, color: "#94a3b8", marginBottom: 4 }}>
                Overall Mastery
              </div>
              <div style={{ fontSize: 11, color: "#475569" }}>
                Retention: {Math.round(retention * 100)}% · Stability:{" "}
                {stabilityDays} days
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: getMasteryColor(currentMastery),
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {masteryPct}%
              </div>
              {masteryDelta !== null && masteryDelta !== 0 && (
                <div
                  style={{
                    fontSize: 12,
                    color: masteryDelta > 0 ? "#22c55e" : "#ef4444",
                  }}
                >
                  {masteryDelta > 0 ? "+" : ""}
                  {masteryDelta}%
                </div>
              )}
            </div>
          </div>
          {/* Mastery bar */}
          <div
            style={{
              marginTop: 12,
              height: 6,
              background: "#1e293b",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${masteryPct}%`,
                background: getMasteryColor(currentMastery),
                borderRadius: 3,
                transition: "width 0.5s",
              }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button onClick={() => setMode("browse")} style={btnStyle("#64ffda")}>
          Study Another Topic
        </button>
        <button
          onClick={() => setMode("comprehension")}
          style={btnStyle("#a78bfa")}
        >
          View Mastery Map
        </button>
        <button onClick={() => setMode("home")} style={btnStyle("#64748b")}>
          Go Home
        </button>
      </div>
    </div>
  );
}
