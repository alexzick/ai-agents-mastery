import TOPICS, { CATEGORIES } from "../data/topics";
import { getCardStatus } from "../utils/sm2";
import { btnStyle } from "../styles";
import { getMastery, getMasteryColor, getRetention } from "../utils/forgetting";
import SpeakButton from "./SpeakButton";

export default function BrowseMode({
  setMode,
  cardData,
  filterCat,
  setFilterCat,
  selectedTopic,
  setSelectedTopic,
  topicMastery,
  setStudyTopicId,
}) {
  const filtered =
    filterCat === "All"
      ? TOPICS
      : TOPICS.filter((t) => t.category === filterCat);

  const startGuidedStudy = (topicId) => {
    setStudyTopicId(topicId);
    setMode("study-flow");
  };

  if (selectedTopic) {
    const topic = selectedTopic;
    const mastery = getMastery(topicMastery?.[topic.id] || {});
    const retention = getRetention(topicMastery?.[topic.id] || {});

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
            onClick={() => setSelectedTopic(null)}
            style={{
              color: "#64748b",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            ← All Topics
          </button>
          {/* Mastery badge */}
          {mastery > 0 && (
            <div
              style={{
                fontSize: 12,
                color: getMasteryColor(mastery),
                fontFamily: "'Space Mono', monospace",
                padding: "4px 12px",
                border: `1px solid ${getMasteryColor(mastery)}33`,
                borderRadius: 100,
              }}
            >
              {Math.round(mastery * 100)}% mastery · {Math.round(retention * 100)}% retention
            </div>
          )}
        </div>

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
          {topic.category} &middot; Topic {topic.order}
        </div>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: "#e2e8f0",
            marginBottom: 8,
          }}
        >
          {topic.title}
        </h1>

        {/* Prerequisites */}
        {topic.prereqs.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 11, color: "#475569" }}>
              Prereqs:
            </span>
            {topic.prereqs.map((pid) => {
              const pt = TOPICS.find((t) => t.id === pid);
              return (
                <span
                  key={pid}
                  onClick={() => setSelectedTopic(pt)}
                  style={{
                    fontSize: 11,
                    color: "#64ffda",
                    background: "#64ffda11",
                    padding: "2px 10px",
                    borderRadius: 100,
                    cursor: "pointer",
                    border: "1px solid #64ffda22",
                  }}
                >
                  {pt?.title}
                </span>
              );
            })}
          </div>
        )}

        {/* Core */}
        <div
          style={{
            fontSize: 16,
            color: "#94a3b8",
            lineHeight: 1.8,
            marginBottom: 32,
            padding: "20px 24px",
            background: "#0f172a",
            borderRadius: 16,
            borderLeft: "4px solid #64ffda",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <strong style={{ color: "#64ffda" }}>Core:</strong>
            <SpeakButton text={topic.core} />
          </div>
          {topic.core}
        </div>

        {/* Analogy */}
        <div
          style={{
            padding: "20px 24px",
            background: "#0f172a",
            borderRadius: 16,
            marginBottom: 24,
            borderLeft: "4px solid #a78bfa",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#64748b",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Analogy <SpeakButton text={topic.analogy} />
          </div>
          <div
            style={{
              color: "#c4b5fd",
              fontSize: 15,
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
            borderRadius: 16,
            padding: "24px 28px",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#64748b",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Full Explanation{" "}
            <SpeakButton text={topic.details?.replace(/[*#`]/g, "")} />
          </div>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "inherit",
              fontSize: 14,
              color: "#94a3b8",
              lineHeight: 1.8,
              margin: 0,
            }}
          >
            {topic.details.trim()}
          </pre>
        </div>

        {/* Flashcard preview */}
        <div
          style={{
            background: "#0f172a",
            borderRadius: 16,
            padding: "24px 28px",
            borderLeft: "4px solid #f59e0b",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#64748b",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Flashcard
          </div>
          <div
            style={{
              fontSize: 14,
              color: "#f59e0b",
              marginBottom: 8,
            }}
          >
            Q: {topic.flashQ}
          </div>
          <div style={{ fontSize: 14, color: "#94a3b8" }}>
            A: {topic.flashA}
          </div>
        </div>

        {/* Start Guided Study button */}
        <div
          style={{
            textAlign: "center",
            padding: "20px 0",
            borderTop: "1px solid #1e293b",
          }}
        >
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12 }}>
            Ready to test your understanding?
          </div>
          <button
            onClick={() => startGuidedStudy(topic.id)}
            style={{
              ...btnStyle("#64ffda"),
              fontSize: 16,
              padding: "14px 32px",
            }}
          >
            Start Guided Study →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
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
        <h2
          style={{
            margin: 0,
            color: "#e2e8f0",
            fontSize: 22,
            fontWeight: 800,
          }}
        >
          All Topics
        </h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
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

      <div style={{ display: "grid", gap: 16 }}>
        {filtered.map((t) => {
          const status = getCardStatus(cardData[t.id]);
          const mastery = getMastery(topicMastery?.[t.id] || {});
          const statusColors = {
            new: "#64748b",
            due: "#f59e0b",
            learned: "#64ffda",
          };
          return (
            <div
              key={t.id}
              onClick={() => setSelectedTopic(t)}
              style={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: 16,
                padding: 24,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#334155";
                e.currentTarget.style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#1e293b";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: 1 }}>
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
                    {t.category} &middot; #{t.order}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#e2e8f0",
                      marginBottom: 8,
                    }}
                  >
                    {t.title}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: "#64748b",
                      lineHeight: 1.6,
                    }}
                  >
                    {t.core}
                  </div>
                  {/* Mastery bar */}
                  {mastery > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <div
                        style={{
                          height: 3,
                          background: "#1e293b",
                          borderRadius: 2,
                          overflow: "hidden",
                          maxWidth: 200,
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${mastery * 100}%`,
                            background: getMasteryColor(mastery),
                            borderRadius: 2,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div
                  style={{
                    marginLeft: 20,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 8,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: statusColors[status],
                      fontFamily: "'Space Mono', monospace",
                      padding: "3px 10px",
                      border: `1px solid ${statusColors[status]}33`,
                      borderRadius: 100,
                    }}
                  >
                    {status.toUpperCase()}
                  </div>
                  {mastery > 0 && (
                    <div
                      style={{
                        fontSize: 11,
                        color: getMasteryColor(mastery),
                        fontFamily: "'Space Mono', monospace",
                        fontWeight: 700,
                      }}
                    >
                      {Math.round(mastery * 100)}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
