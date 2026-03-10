import { useState } from "react";
import TOPICS, { CATEGORIES } from "../data/topics";
import { btnStyle } from "../styles";
import FlashcardSingle, { DirectionToggle } from "./FlashcardSingle";

export default function FlashcardMode({
  studyQueue,
  filterCat,
  setFilterCat,
  currentIdx,
  setCurrentIdx,
  rateCard,
  setMode,
}) {
  const [direction, setDirection] = useState("q-to-a");

  const filtered =
    filterCat === "All"
      ? TOPICS
      : TOPICS.filter((t) => t.category === filterCat);
  const queue = studyQueue.length > 0 ? studyQueue : filtered;
  const topic = queue[currentIdx];

  if (!topic)
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: "#64ffda", marginBottom: 8 }}>All caught up!</h2>
        <p style={{ color: "#64748b" }}>
          No cards due right now. Come back later or browse all topics.
        </p>
        <button
          onClick={() => setMode("home")}
          style={{ marginTop: 24, ...btnStyle("#64ffda") }}
        >
          Back to Home
        </button>
      </div>
    );

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
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
        <div
          style={{
            fontSize: 12,
            color: "#64748b",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          {currentIdx + 1} / {queue.length}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.slice(1).map((c) => (
            <button
              key={c}
              onClick={() => {
                setFilterCat(c);
                setCurrentIdx(0);
              }}
              style={{
                fontSize: 11,
                padding: "4px 10px",
                borderRadius: 100,
                border: `1px solid ${
                  filterCat === c ? "#64ffda" : "#1e293b"
                }`,
                background: "none",
                color: filterCat === c ? "#64ffda" : "#475569",
                cursor: "pointer",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Direction toggle */}
      <div style={{ marginBottom: 20 }}>
        <DirectionToggle direction={direction} setDirection={setDirection} />
      </div>

      {/* Flashcard */}
      <FlashcardSingle
        topic={topic}
        direction={direction}
        onRate={(id, quality) => {
          rateCard(id, quality);
          const next = currentIdx + 1;
          if (next < queue.length) {
            setCurrentIdx(next);
          } else {
            setMode("home");
          }
        }}
      />
    </div>
  );
}
