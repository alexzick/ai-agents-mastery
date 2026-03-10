import { useState } from "react";
import TOPICS, { CATEGORIES } from "../data/topics";
import FeynmanSingle from "./FeynmanSingle";

export default function FeynmanMode({
  setMode,
  feynmanText,
  setFeynmanText,
  feynmanFeedback,
  setFeynmanFeedback,
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredTopics =
    selectedCategory === "All"
      ? TOPICS
      : TOPICS.filter((t) => t.category === selectedCategory);

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
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "6px 14px",
              borderRadius: 100,
              border: "1px solid",
              borderColor: selectedCategory === cat ? "#64ffda" : "#1e293b",
              background: selectedCategory === cat ? "#64ffda15" : "transparent",
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
          <FeynmanSingle
            key={t.id}
            topic={t}
            feynmanText={feynmanText}
            setFeynmanText={setFeynmanText}
            feynmanFeedback={feynmanFeedback}
            setFeynmanFeedback={setFeynmanFeedback}
          />
        ))}
      </div>
    </div>
  );
}
