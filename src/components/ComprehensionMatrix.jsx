import TOPICS, { CATEGORIES } from "../data/topics";
import { btnStyle } from "../styles";
import {
  getMastery,
  getMasteryColor,
  getRetention,
  isDueForReview,
  getUrgency,
} from "../utils/forgetting";

export default function ComprehensionMatrix({
  topicMastery,
  setMode,
  setStudyTopicId,
}) {
  const categories = CATEGORIES.filter((c) => c !== "All");

  // Per-category mastery
  const categoryData = categories.map((cat) => {
    const catTopics = TOPICS.filter((t) => t.category === cat);
    const masteries = catTopics.map((t) => getMastery(topicMastery[t.id] || {}));
    const avgMastery =
      masteries.length > 0
        ? masteries.reduce((a, b) => a + b, 0) / masteries.length
        : 0;
    return { cat, topics: catTopics, avgMastery, masteries };
  });

  // Overall mastery
  const allMasteries = TOPICS.map((t) => getMastery(topicMastery[t.id] || {}));
  const overallMastery =
    allMasteries.length > 0
      ? allMasteries.reduce((a, b) => a + b, 0) / allMasteries.length
      : 0;

  // Topics needing review (R < 0.5), sorted by urgency
  const needsReview = TOPICS.filter((t) =>
    isDueForReview(topicMastery[t.id] || {})
  ).sort(
    (a, b) =>
      getUrgency(topicMastery[b.id] || {}) -
      getUrgency(topicMastery[a.id] || {})
  );

  const startStudy = (topicId) => {
    setStudyTopicId(topicId);
    setMode("study-flow");
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
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
            fontSize: 11,
            color: "#a78bfa",
            fontFamily: "'Space Mono', monospace",
            padding: "4px 12px",
            border: "1px solid #a78bfa33",
            borderRadius: 100,
          }}
        >
          COMPREHENSION MATRIX
        </div>
      </div>

      {/* Overall Score */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 40,
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 20,
          padding: 32,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#64748b",
            letterSpacing: 3,
            marginBottom: 8,
            fontFamily: "'Space Mono', monospace",
          }}
        >
          OVERALL MASTERY
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: getMasteryColor(overallMastery),
            fontFamily: "'Space Mono', monospace",
            lineHeight: 1,
          }}
        >
          {Math.round(overallMastery * 100)}%
        </div>
        <div
          style={{
            marginTop: 16,
            height: 8,
            background: "#1e293b",
            borderRadius: 4,
            overflow: "hidden",
            maxWidth: 400,
            margin: "16px auto 0",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${overallMastery * 100}%`,
              background: `linear-gradient(90deg, ${getMasteryColor(overallMastery)}, ${getMasteryColor(overallMastery)}88)`,
              borderRadius: 4,
              transition: "width 0.5s",
            }}
          />
        </div>
        <div style={{ fontSize: 13, color: "#64748b", marginTop: 12 }}>
          {TOPICS.length} topics · {needsReview.length} need review ·{" "}
          {TOPICS.length - needsReview.length} on track
        </div>
      </div>

      {/* Category Summary Bars */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
          marginBottom: 40,
        }}
      >
        {categoryData.map(({ cat, topics, avgMastery }) => (
          <div
            key={cat}
            style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 14,
              padding: "16px 20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "#e2e8f0",
                  fontWeight: 600,
                  maxWidth: "70%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {cat}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: getMasteryColor(avgMastery),
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {Math.round(avgMastery * 100)}%
              </div>
            </div>
            <div
              style={{
                height: 4,
                background: "#1e293b",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${avgMastery * 100}%`,
                  background: getMasteryColor(avgMastery),
                  borderRadius: 2,
                  transition: "width 0.5s",
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>
              {topics.length} topics
            </div>
          </div>
        ))}
      </div>

      {/* Heat Grid */}
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 20,
          padding: 28,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            fontSize: 13,
            letterSpacing: 3,
            color: "#64748b",
            textTransform: "uppercase",
            marginBottom: 20,
            fontFamily: "'Space Mono', monospace",
          }}
        >
          Topic Heat Map
        </div>

        {categoryData.map(({ cat, topics }) => (
          <div key={cat} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 12,
                color: "#94a3b8",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              {cat}
            </div>
            <div
              style={{
                display: "flex",
                gap: 4,
                flexWrap: "wrap",
              }}
            >
              {topics.map((t) => {
                const mastery = getMastery(topicMastery[t.id] || {});
                const retention = getRetention(topicMastery[t.id] || {});
                const due = isDueForReview(topicMastery[t.id] || {});
                return (
                  <div
                    key={t.id}
                    onClick={() => startStudy(t.id)}
                    title={`${t.title}\nMastery: ${Math.round(mastery * 100)}%\nRetention: ${Math.round(retention * 100)}%`}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 6,
                      background: mastery > 0 ? getMasteryColor(mastery) + "33" : "#1e293b",
                      border: `2px solid ${
                        due && mastery > 0
                          ? "#f59e0b"
                          : mastery > 0
                          ? getMasteryColor(mastery) + "66"
                          : "#1e293b"
                      }`,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 8,
                      color: mastery > 0 ? getMasteryColor(mastery) : "#334155",
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      transition: "all 0.2s",
                      animation:
                        due && mastery > 0 ? "pulse-border 2s infinite" : "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.2)";
                      e.currentTarget.style.zIndex = "10";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.zIndex = "1";
                    }}
                  >
                    {mastery > 0 ? Math.round(mastery * 100) : "·"}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid #1e293b",
            flexWrap: "wrap",
          }}
        >
          {[
            { color: "#ef4444", label: "0-20%" },
            { color: "#f97316", label: "20-40%" },
            { color: "#f59e0b", label: "40-60%" },
            { color: "#64ffda", label: "60-80%" },
            { color: "#22c55e", label: "80-100%" },
            { color: "#334155", label: "Not started" },
          ].map((l) => (
            <div
              key={l.label}
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: l.color + "44",
                  border: `1px solid ${l.color}66`,
                }}
              />
              <span style={{ fontSize: 11, color: "#64748b" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Needs Review */}
      {needsReview.length > 0 && (
        <div
          style={{
            background: "#0f172a",
            border: "1px solid #f59e0b33",
            borderRadius: 20,
            padding: 28,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: 3,
              color: "#f59e0b",
              textTransform: "uppercase",
              marginBottom: 20,
              fontFamily: "'Space Mono', monospace",
            }}
          >
            Needs Review ({needsReview.length})
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            {needsReview.slice(0, 15).map((t) => {
              const data = topicMastery[t.id] || {};
              const retention = getRetention(data);
              const mastery = getMastery(data);
              return (
                <div
                  key={t.id}
                  onClick={() => startStudy(t.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 16px",
                    background: "#020817",
                    borderRadius: 10,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    border: "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#f59e0b44";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                >
                  {/* Urgency dot */}
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: getMasteryColor(retention),
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        color: "#e2e8f0",
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.title}
                    </div>
                    <div style={{ fontSize: 11, color: "#475569" }}>
                      {t.category}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: getMasteryColor(retention),
                        fontFamily: "'Space Mono', monospace",
                      }}
                    >
                      {Math.round(retention * 100)}% R
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#475569",
                        fontFamily: "'Space Mono', monospace",
                      }}
                    >
                      {Math.round(mastery * 100)}% M
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {needsReview.length > 15 && (
            <div
              style={{
                fontSize: 12,
                color: "#64748b",
                textAlign: "center",
                marginTop: 12,
              }}
            >
              + {needsReview.length - 15} more topics need review
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {needsReview.length > 0 && (
          <button
            onClick={() => startStudy(needsReview[0].id)}
            style={btnStyle("#f59e0b")}
          >
            Review Most Urgent Topic
          </button>
        )}
        <button onClick={() => setMode("browse")} style={btnStyle("#a78bfa")}>
          Browse All Topics
        </button>
        <button onClick={() => setMode("home")} style={btnStyle("#64748b")}>
          Go Home
        </button>
      </div>
    </div>
  );
}
