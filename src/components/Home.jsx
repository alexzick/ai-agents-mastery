import { useState } from "react";
import TOPICS, { CATEGORIES } from "../data/topics";
import { getCardStatus } from "../utils/sm2";
import { btnStyle } from "../styles";
import {
  getMastery,
  getMasteryColor,
  getRetention,
  isDueForReview,
} from "../utils/forgetting";
import ApiKeySettings from "./ApiKeySettings";

export default function Home({
  dueCount,
  streak,
  completedToday,
  cardData,
  topicMastery,
  setMode,
  setCurrentIdx,
  setStudyTopicId,
}) {
  const [expandedCats, setExpandedCats] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const toggleCat = (cat) =>
    setExpandedCats((p) => ({ ...p, [cat]: !p[cat] }));

  const categories = CATEGORIES.filter((c) => c !== "All");

  // Overall mastery
  const allMasteries = TOPICS.map((t) =>
    getMastery(topicMastery?.[t.id] || {})
  );
  const overallMastery =
    allMasteries.reduce((a, b) => a + b, 0) / allMasteries.length;
  const reviewCount = TOPICS.filter((t) =>
    isDueForReview(topicMastery?.[t.id] || {})
  ).length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      {/* Settings Modal */}
      {showSettings && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSettings(false);
          }}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 20,
              padding: 32,
              maxWidth: 500,
              width: "100%",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowSettings(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "none",
                border: "none",
                color: "#64748b",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
            <h3
              style={{
                color: "#e2e8f0",
                margin: "0 0 24px",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              Settings
            </h3>
            <ApiKeySettings />
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        {/* Settings gear */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <button
            onClick={() => setShowSettings(true)}
            style={{
              background: "none",
              border: "1px solid #1e293b",
              borderRadius: 10,
              padding: "6px 12px",
              color: "#64748b",
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            title="Settings"
          >
            ⚙️ <span style={{ fontSize: 12 }}>Settings</span>
          </button>
        </div>

        <div
          style={{
            fontSize: 13,
            letterSpacing: 6,
            color: "#64ffda",
            textTransform: "uppercase",
            marginBottom: 12,
            fontFamily: "'Space Mono', monospace",
          }}
        >
          MASTERY SYSTEM
        </div>
        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 900,
            lineHeight: 1.05,
            margin: "0 0 16px",
            letterSpacing: "-2px",
          }}
        >
          <span style={{ color: "#e2e8f0" }}>AI Agents</span>
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #64ffda, #00b4d8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Deep Mastery
          </span>
        </h1>
        <p
          style={{
            color: "#94a3b8",
            fontSize: 16,
            maxWidth: 520,
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          Active Recall + Forgetting Curve + Feynman Technique.
          <br />
          {TOPICS.length} comprehensive topics across{" "}
          {new Set(TOPICS.map((t) => t.category)).size} categories. Built to
          make this knowledge permanent.
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 40,
        }}
      >
        {[
          {
            label: "Overall Mastery",
            value: `${Math.round(overallMastery * 100)}%`,
            color: getMasteryColor(overallMastery),
          },
          {
            label: "Need Review",
            value: reviewCount,
            color: reviewCount > 0 ? "#f59e0b" : "#64ffda",
          },
          { label: "Streak", value: streak, color: "#a78bfa" },
          { label: "Today", value: completedToday, color: "#34d399" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 16,
              padding: "20px 16px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: s.color,
                fontFamily: "'Space Mono', monospace",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                letterSpacing: 2,
                textTransform: "uppercase",
                marginTop: 4,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Mode cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          marginBottom: 40,
        }}
      >
        {[
          {
            icon: "⚡",
            title: "Spaced Repetition",
            sub: `${dueCount} cards due`,
            desc: "Review flashcards with bidirectional Q↔A. Forgetting curve tracks your retention over time.",
            action: () => {
              setMode("flashcards");
              setCurrentIdx(0);
            },
            accent: "#f59e0b",
            badge: dueCount > 0 ? `${dueCount} DUE` : "UP TO DATE",
          },
          {
            icon: "🧠",
            title: "Feynman Lab",
            sub: "Active recall",
            desc: "Explain concepts in your own words. Get instant AI feedback on gaps. Use voice input.",
            action: () => setMode("feynman"),
            accent: "#64ffda",
            badge: "AI POWERED",
          },
          {
            icon: "📚",
            title: "Deep Study",
            sub: "Read & test",
            desc: "Browse topics with TTS, then enter guided study flow: Read → Explain → Recall → Results.",
            action: () => setMode("browse"),
            accent: "#a78bfa",
            badge: `${TOPICS.length} TOPICS`,
          },
          {
            icon: "📊",
            title: "Comprehension",
            sub: "Mastery matrix",
            desc: "Visual heat map of your knowledge. See which topics are decaying and need review.",
            action: () => setMode("comprehension"),
            accent: "#ec4899",
            badge: `${Math.round(overallMastery * 100)}% MASTERY`,
          },
          {
            icon: "🗺️",
            title: "Curriculum",
            sub: "Learning path",
            desc: "Follow a structured 9-phase roadmap with milestones and projects.",
            action: () => setMode("curriculum"),
            accent: "#3b82f6",
            badge: "ROADMAP",
          },
        ].map((card) => (
          <div
            key={card.title}
            onClick={card.action}
            style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 20,
              padding: 28,
              cursor: "pointer",
              transition: "all 0.2s",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = card.accent;
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1e293b";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: card.accent + "22",
                color: card.accent,
                fontSize: 10,
                padding: "4px 10px",
                borderRadius: 100,
                letterSpacing: 1.5,
                fontFamily: "'Space Mono', monospace",
              }}
            >
              {card.badge}
            </div>
            <div style={{ fontSize: 36, marginBottom: 12 }}>{card.icon}</div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#e2e8f0",
                marginBottom: 4,
              }}
            >
              {card.title}
            </div>
            <div
              style={{
                fontSize: 12,
                color: card.accent,
                marginBottom: 12,
                fontFamily: "'Space Mono', monospace",
              }}
            >
              {card.sub}
            </div>
            <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
              {card.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Topic progress with retention bars */}
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 20,
          padding: 28,
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
          Topic Progress
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 12, color: "#64748b" }}>
              {
                TOPICS.filter(
                  (t) => getMastery(topicMastery?.[t.id] || {}) >= 0.6
                ).length
              }{" "}
              / {TOPICS.length} proficient (60%+)
            </span>
            <span style={{ fontSize: 12, color: getMasteryColor(overallMastery) }}>
              {Math.round(overallMastery * 100)}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              background: "#1e293b",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${overallMastery * 100}%`,
                background: `linear-gradient(90deg, ${getMasteryColor(overallMastery)}, ${getMasteryColor(overallMastery)}88)`,
                borderRadius: 3,
                transition: "width 0.5s",
              }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gap: 4 }}>
          {categories.map((cat) => {
            const catTopics = TOPICS.filter((t) => t.category === cat);
            const catMasteries = catTopics.map((t) =>
              getMastery(topicMastery?.[t.id] || {})
            );
            const catAvg =
              catMasteries.length > 0
                ? catMasteries.reduce((a, b) => a + b, 0) / catMasteries.length
                : 0;
            const isOpen = expandedCats[cat];
            return (
              <div key={cat}>
                <div
                  onClick={() => toggleCat(cat)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 0",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "#475569",
                      width: 16,
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    {isOpen ? "▾" : "▸"}
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      color: "#e2e8f0",
                      flex: 1,
                      fontWeight: 600,
                    }}
                  >
                    {cat}
                  </span>
                  {/* Category mastery bar */}
                  <div
                    style={{
                      width: 60,
                      height: 4,
                      background: "#1e293b",
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${catAvg * 100}%`,
                        background: getMasteryColor(catAvg),
                        borderRadius: 2,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: getMasteryColor(catAvg),
                      fontFamily: "'Space Mono', monospace",
                      minWidth: 35,
                      textAlign: "right",
                    }}
                  >
                    {Math.round(catAvg * 100)}%
                  </span>
                </div>
                {isOpen && (
                  <div
                    style={{
                      display: "grid",
                      gap: 6,
                      paddingLeft: 26,
                      paddingBottom: 8,
                    }}
                  >
                    {catTopics.map((t) => {
                      const mastery = getMastery(topicMastery?.[t.id] || {});
                      const retention = getRetention(topicMastery?.[t.id] || {});
                      const due = isDueForReview(topicMastery?.[t.id] || {});
                      return (
                        <div
                          key={t.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setStudyTopicId(t.id);
                            setMode("study-flow");
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            cursor: "pointer",
                            padding: "4px 8px",
                            borderRadius: 6,
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#020817";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <div
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background:
                                mastery > 0 ? getMasteryColor(mastery) : "#334155",
                              flexShrink: 0,
                              animation:
                                due && mastery > 0
                                  ? "pulse-border 2s infinite"
                                  : "none",
                            }}
                          />
                          <div
                            style={{
                              fontSize: 13,
                              color: "#94a3b8",
                              flex: 1,
                            }}
                          >
                            {t.title}
                          </div>
                          {/* Retention mini-bar */}
                          <div
                            style={{
                              width: 40,
                              height: 3,
                              background: "#1e293b",
                              borderRadius: 2,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${(mastery > 0 ? retention : 0) * 100}%`,
                                background:
                                  mastery > 0
                                    ? getMasteryColor(retention)
                                    : "#334155",
                                borderRadius: 2,
                              }}
                            />
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color:
                                mastery > 0
                                  ? getMasteryColor(mastery)
                                  : "#334155",
                              fontFamily: "'Space Mono', monospace",
                              letterSpacing: 1,
                              minWidth: 28,
                              textAlign: "right",
                            }}
                          >
                            {mastery > 0
                              ? `${Math.round(mastery * 100)}%`
                              : "NEW"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
