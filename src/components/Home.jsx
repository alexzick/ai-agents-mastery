import { useState } from "react";
import TOPICS, { CATEGORIES } from "../data/topics";
import { getCardStatus } from "../utils/sm2";
import { btnStyle } from "../styles";

export default function Home({
  dueCount,
  streak,
  completedToday,
  cardData,
  setMode,
  setCurrentIdx,
  setFlipped,
}) {
  const [expandedCats, setExpandedCats] = useState({});
  const toggleCat = (cat) =>
    setExpandedCats((p) => ({ ...p, [cat]: !p[cat] }));

  const categories = CATEGORIES.filter((c) => c !== "All");

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
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
          Flashcards + Spaced Repetition + Feynman Technique.
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
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 40,
        }}
      >
        {[
          {
            label: "Due for Review",
            value: dueCount,
            color: dueCount > 0 ? "#f59e0b" : "#64ffda",
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
              padding: "24px 20px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 40,
                fontWeight: 900,
                color: s.color,
                fontFamily: "'Space Mono', monospace",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 12,
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
            desc: "Review cards using the SM-2 algorithm. Rate your recall to schedule the next review.",
            action: () => {
              setMode("flashcards");
              setCurrentIdx(0);
              setFlipped(false);
            },
            accent: "#f59e0b",
            badge: dueCount > 0 ? `${dueCount} DUE` : "UP TO DATE",
          },
          {
            icon: "🧠",
            title: "Feynman Lab",
            sub: "Active recall",
            desc: "Explain concepts in your own words. Get instant AI feedback on gaps.",
            action: () => setMode("feynman"),
            accent: "#64ffda",
            badge: "AI POWERED",
          },
          {
            icon: "📚",
            title: "Deep Study",
            sub: "Full reference",
            desc: "Browse all topics with complete explanations, code examples, and analogies.",
            action: () => setMode("browse"),
            accent: "#a78bfa",
            badge: `${TOPICS.length} TOPICS`,
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

      {/* Topic progress */}
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
                  (t) => getCardStatus(cardData[t.id]) === "learned"
                ).length
              }{" "}
              / {TOPICS.length} mastered
            </span>
            <span style={{ fontSize: 12, color: "#64ffda" }}>
              {Math.round(
                (TOPICS.filter(
                  (t) => getCardStatus(cardData[t.id]) === "learned"
                ).length /
                  TOPICS.length) *
                  100
              )}
              %
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
                width: `${
                  (TOPICS.filter(
                    (t) => getCardStatus(cardData[t.id]) === "learned"
                  ).length /
                    TOPICS.length) *
                  100
                }%`,
                background:
                  "linear-gradient(90deg, #64ffda, #00b4d8)",
                borderRadius: 3,
                transition: "width 0.5s",
              }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gap: 4 }}>
          {categories.map((cat) => {
            const catTopics = TOPICS.filter((t) => t.category === cat);
            const mastered = catTopics.filter(
              (t) => getCardStatus(cardData[t.id]) === "learned"
            ).length;
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
                  <span style={{ fontSize: 14, color: "#e2e8f0", flex: 1, fontWeight: 600 }}>
                    {cat}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: mastered === catTopics.length ? "#64ffda" : "#64748b",
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    {mastered}/{catTopics.length}
                  </span>
                </div>
                {isOpen && (
                  <div style={{ display: "grid", gap: 6, paddingLeft: 26, paddingBottom: 8 }}>
                    {catTopics.map((t) => {
                      const status = getCardStatus(cardData[t.id]);
                      const colors = { new: "#334155", due: "#f59e0b", learned: "#64ffda" };
                      const labels = { new: "NEW", due: "DUE", learned: "✓" };
                      return (
                        <div
                          key={t.id}
                          style={{ display: "flex", alignItems: "center", gap: 10 }}
                        >
                          <div
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: colors[status],
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ fontSize: 13, color: "#94a3b8", flex: 1 }}>
                            {t.title}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: colors[status],
                              fontFamily: "'Space Mono', monospace",
                              letterSpacing: 1,
                            }}
                          >
                            {labels[status]}
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
