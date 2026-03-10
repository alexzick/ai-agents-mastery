import TOPICS from "../data/topics";
import CURRICULUM from "../data/curriculum";
import { getCardStatus } from "../utils/sm2";

export default function CurriculumMode({
  setMode,
  cardData,
  setSelectedTopic,
}) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
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
          Learning Curriculum
        </h2>
        <div
          style={{
            fontSize: 11,
            color: "#3b82f6",
            fontFamily: "'Space Mono', monospace",
            padding: "4px 12px",
            border: "1px solid #3b82f633",
            borderRadius: 100,
          }}
        >
          9-PHASE ROADMAP
        </div>
      </div>

      <p
        style={{
          color: "#64748b",
          marginBottom: 40,
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        Follow this structured learning path from foundations to production.
        Each phase builds on the previous one. Complete the milestones and
        project before moving to the next phase.
      </p>

      <div style={{ display: "grid", gap: 32 }}>
        {CURRICULUM.map((phase) => {
          const phaseTopics = phase.topics.map((id) =>
            TOPICS.find((t) => t.id === id)
          ).filter(Boolean);
          const masteredCount = phaseTopics.filter(
            (t) => getCardStatus(cardData[t.id]) === "learned"
          ).length;
          const totalCount = phaseTopics.length;
          const progress = totalCount > 0 ? masteredCount / totalCount : 0;

          return (
            <div
              key={phase.phase}
              style={{
                background: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              {/* Phase header */}
              <div
                style={{
                  padding: "24px 28px",
                  borderBottom: "1px solid #1e293b",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 4,
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: phase.color + "22",
                        color: phase.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 900,
                        fontFamily: "'Space Mono', monospace",
                      }}
                    >
                      {phase.phase}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: "#e2e8f0",
                        }}
                      >
                        {phase.title}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#64748b",
                        }}
                      >
                        {phase.subtitle}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: phase.color,
                      fontFamily: "'Space Mono', monospace",
                      marginBottom: 4,
                    }}
                  >
                    {phase.duration}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                    }}
                  >
                    {masteredCount}/{totalCount} mastered
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: 3,
                  background: "#1e293b",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress * 100}%`,
                    background: phase.color,
                    transition: "width 0.5s",
                  }}
                />
              </div>

              <div style={{ padding: "20px 28px" }}>
                {/* Topics */}
                <div
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 12,
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  Topics
                </div>
                <div
                  style={{
                    display: "grid",
                    gap: 8,
                    marginBottom: 20,
                  }}
                >
                  {phaseTopics.map((t) => {
                    const status = getCardStatus(cardData[t.id]);
                    const colors = {
                      new: "#334155",
                      due: "#f59e0b",
                      learned: "#64ffda",
                    };
                    return (
                      <div
                        key={t.id}
                        onClick={() => {
                          setSelectedTopic(t);
                          setMode("browse");
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "8px 12px",
                          borderRadius: 8,
                          cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#1e293b44")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            border: `2px solid ${colors[status]}`,
                            background:
                              status === "learned"
                                ? colors[status]
                                : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 10,
                            color:
                              status === "learned" ? "#0f172a" : colors[status],
                            flexShrink: 0,
                          }}
                        >
                          {status === "learned" ? "✓" : t.order}
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            color:
                              status === "learned" ? "#64ffda" : "#94a3b8",
                            flex: 1,
                          }}
                        >
                          {t.title}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Milestones */}
                <div
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 10,
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  Milestones
                </div>
                <div
                  style={{
                    display: "grid",
                    gap: 6,
                    marginBottom: 20,
                  }}
                >
                  {phase.milestones.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        fontSize: 13,
                        color: "#64748b",
                        lineHeight: 1.6,
                      }}
                    >
                      <span style={{ color: phase.color, flexShrink: 0 }}>
                        ◇
                      </span>
                      {m}
                    </div>
                  ))}
                </div>

                {/* Project */}
                <div
                  style={{
                    padding: "16px 20px",
                    background: "#0d1117",
                    borderRadius: 12,
                    borderLeft: `3px solid ${phase.color}44`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: phase.color,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      marginBottom: 6,
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    Phase Project
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#94a3b8",
                      lineHeight: 1.7,
                    }}
                  >
                    {phase.project}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
