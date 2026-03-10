import TOPICS, { CATEGORIES } from "../data/topics";
import { btnStyle } from "../styles";

export default function FlashcardMode({
  studyQueue,
  filterCat,
  setFilterCat,
  currentIdx,
  setCurrentIdx,
  flipped,
  setFlipped,
  rateCard,
  setMode,
}) {
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
          marginBottom: 32,
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
                setFlipped(false);
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
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = "#334155")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = "#1e293b")
        }
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
          {flipped ? "ANSWER" : "QUESTION"}
        </div>
        {!flipped ? (
          <div>
            <div
              style={{
                fontSize: 13,
                color: "#64ffda",
                marginBottom: 16,
                fontFamily: "'Space Mono', monospace",
              }}
            >
              Q:
            </div>
            <div
              style={{
                fontSize: 20,
                color: "#e2e8f0",
                lineHeight: 1.5,
                fontWeight: 600,
              }}
            >
              {topic.flashQ}
            </div>
            <div style={{ marginTop: 32, fontSize: 12, color: "#334155" }}>
              tap to reveal answer
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
              }}
            >
              A:
            </div>
            <div
              style={{
                fontSize: 18,
                color: "#e2e8f0",
                lineHeight: 1.6,
              }}
            >
              {topic.flashA}
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

      {/* Rating */}
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
                  rateCard(topic.id, r.q);
                  const next = currentIdx + 1;
                  if (next < queue.length) {
                    setCurrentIdx(next);
                    setFlipped(false);
                  } else {
                    setMode("home");
                  }
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
