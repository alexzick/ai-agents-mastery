import { useState, useEffect } from "react";
import TOPICS from "./data/topics";
import { sm2, isDue } from "./utils/sm2";
import {
  updateStability,
  feynmanToQuality,
} from "./utils/forgetting";
import {
  loadCardData,
  saveCardData,
  loadFeynmanTexts,
  saveFeynmanTexts,
  loadTopicMastery,
  saveTopicMastery,
  loadStats,
  saveStats,
} from "./utils/storage";
import Home from "./components/Home";
import FlashcardMode from "./components/FlashcardMode";
import FeynmanMode from "./components/FeynmanMode";
import BrowseMode from "./components/BrowseMode";
import CurriculumMode from "./components/CurriculumMode";
import StudyFlowMode from "./components/StudyFlowMode";
import ComprehensionMatrix from "./components/ComprehensionMatrix";
import AIChatPanel from "./components/AIChatPanel";

export default function App() {
  const [mode, setMode] = useState("home");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [filterCat, setFilterCat] = useState("All");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [studyTopicId, setStudyTopicId] = useState(null);

  // Persistent state
  const [cardData, setCardData] = useState(loadCardData);
  const [feynmanText, setFeynmanText] = useState(loadFeynmanTexts);
  const [feynmanFeedback, setFeynmanFeedback] = useState({});
  const [topicMastery, setTopicMastery] = useState(loadTopicMastery);

  const initialStats = loadStats();
  const [streak, setStreak] = useState(initialStats.streak);
  const [completedToday, setCompletedToday] = useState(
    initialStats.completedToday
  );

  // Derived: study queue (uses forgetting curve via isDue)
  const studyQueue = TOPICS.filter((t) =>
    isDue(cardData[t.id], topicMastery[t.id])
  );
  const dueCount = studyQueue.length;

  // Chat panel context — derive current topic based on active mode
  const chatTopic = (() => {
    if (mode === "browse" && selectedTopic) return selectedTopic; // already a topic object
    if (mode === "study-flow" && studyTopicId)
      return TOPICS.find((t) => t.id === studyTopicId) || null;
    return null;
  })();
  const chatContextLabel =
    mode === "browse" ? "Deep Study" : mode === "study-flow" ? "Study Flow" : mode === "curriculum" ? "Curriculum" : null;
  const showChat = ["browse", "curriculum", "study-flow"].includes(mode);

  // Persist on change
  useEffect(() => saveCardData(cardData), [cardData]);
  useEffect(() => saveFeynmanTexts(feynmanText), [feynmanText]);
  useEffect(() => saveTopicMastery(topicMastery), [topicMastery]);
  useEffect(
    () => saveStats({ streak, completedToday }),
    [streak, completedToday]
  );

  const rateCard = (id, quality) => {
    const existing = cardData[id] || {};
    const updated = sm2(existing, quality);
    setCardData((prev) => ({ ...prev, [id]: updated }));
    setCompletedToday((p) => p + 1);
    if (quality >= 3) setStreak((p) => p + 1);
    else setStreak(0);
  };

  /**
   * Update topic mastery data after a study activity.
   * @param {string} topicId
   * @param {string} type - "feynman" or "flashcard"
   * @param {number} score - Feynman: 1-10, Flashcard: 0-5 quality
   */
  const updateMastery = (topicId, type, score) => {
    setTopicMastery((prev) => {
      const existing = prev[topicId] || {
        stability: 1,
        lastReviewDate: null,
        feynmanHighScore: 0,
        flashcardHistory: [],
        flowCompletions: 0,
      };

      const updated = { ...existing };

      if (type === "feynman") {
        // Map Feynman 1-10 to quality 0-5 for stability update
        const quality = feynmanToQuality(score);
        updated.stability = updateStability(updated.stability, quality);
        updated.lastReviewDate = new Date().toISOString();
        if (score > (updated.feynmanHighScore || 0)) {
          updated.feynmanHighScore = score;
        }
      } else if (type === "flashcard") {
        updated.stability = updateStability(updated.stability, score);
        updated.lastReviewDate = new Date().toISOString();
        // Track last 10 flashcard attempts for richer history
        const history = [...(updated.flashcardHistory || [])];
        history.push({
          quality: score,
          correct: score >= 3,
          timestamp: new Date().toISOString(),
        });
        updated.flashcardHistory = history.slice(-10);
        // Update accuracy stats
        const last = updated.flashcardHistory;
        updated.flashcardAccuracy =
          last.filter((h) => h.correct).length / last.length;
        updated.flashcardAttempts = (updated.flashcardAttempts || 0) + 1;
      }

      return { ...prev, [topicId]: updated };
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020817",
        color: "#e2e8f0",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        textarea:focus { outline: none; border-color: #64ffda !important; }
        input:focus { outline: none; border-color: #64ffda !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
          70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: #f59e0b44; }
          50% { border-color: #f59e0b; }
        }
      `}</style>

      {mode === "home" && (
        <Home
          dueCount={dueCount}
          streak={streak}
          completedToday={completedToday}
          cardData={cardData}
          topicMastery={topicMastery}
          setMode={setMode}
          setCurrentIdx={setCurrentIdx}
          setStudyTopicId={setStudyTopicId}
        />
      )}
      {mode === "flashcards" && (
        <FlashcardMode
          studyQueue={studyQueue}
          filterCat={filterCat}
          setFilterCat={setFilterCat}
          currentIdx={currentIdx}
          setCurrentIdx={setCurrentIdx}
          rateCard={rateCard}
          setMode={setMode}
        />
      )}
      {mode === "feynman" && (
        <FeynmanMode
          setMode={setMode}
          feynmanText={feynmanText}
          setFeynmanText={setFeynmanText}
          feynmanFeedback={feynmanFeedback}
          setFeynmanFeedback={setFeynmanFeedback}
        />
      )}
      {mode === "browse" && (
        <BrowseMode
          setMode={setMode}
          cardData={cardData}
          filterCat={filterCat}
          setFilterCat={setFilterCat}
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
          topicMastery={topicMastery}
          setStudyTopicId={setStudyTopicId}
        />
      )}
      {mode === "curriculum" && (
        <CurriculumMode
          setMode={setMode}
          cardData={cardData}
          setSelectedTopic={setSelectedTopic}
        />
      )}
      {mode === "study-flow" && studyTopicId && (
        <StudyFlowMode
          topicId={studyTopicId}
          setMode={setMode}
          feynmanText={feynmanText}
          setFeynmanText={setFeynmanText}
          feynmanFeedback={feynmanFeedback}
          setFeynmanFeedback={setFeynmanFeedback}
          rateCard={rateCard}
          topicMastery={topicMastery}
          updateMastery={updateMastery}
        />
      )}
      {mode === "comprehension" && (
        <ComprehensionMatrix
          topicMastery={topicMastery}
          setMode={setMode}
          setStudyTopicId={setStudyTopicId}
        />
      )}

      {/* AI Study Buddy — floating chat panel */}
      {showChat && (
        <AIChatPanel topic={chatTopic} contextLabel={chatContextLabel} />
      )}
    </div>
  );
}
