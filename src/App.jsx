import { useState, useEffect } from "react";
import TOPICS from "./data/topics";
import { sm2, isDue } from "./utils/sm2";
import {
  loadCardData,
  saveCardData,
  loadFeynmanTexts,
  saveFeynmanTexts,
  loadStats,
  saveStats,
} from "./utils/storage";
import Home from "./components/Home";
import FlashcardMode from "./components/FlashcardMode";
import FeynmanMode from "./components/FeynmanMode";
import BrowseMode from "./components/BrowseMode";
import CurriculumMode from "./components/CurriculumMode";

export default function App() {
  const [mode, setMode] = useState("home");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [filterCat, setFilterCat] = useState("All");
  const [selectedTopic, setSelectedTopic] = useState(null);

  // Persistent state
  const [cardData, setCardData] = useState(loadCardData);
  const [feynmanText, setFeynmanText] = useState(loadFeynmanTexts);
  const [feynmanFeedback, setFeynmanFeedback] = useState({});

  const initialStats = loadStats();
  const [streak, setStreak] = useState(initialStats.streak);
  const [completedToday, setCompletedToday] = useState(
    initialStats.completedToday
  );

  // Derived: study queue
  const studyQueue = TOPICS.filter((t) => isDue(cardData[t.id]));
  const dueCount = studyQueue.length;

  // Persist on change
  useEffect(() => saveCardData(cardData), [cardData]);
  useEffect(() => saveFeynmanTexts(feynmanText), [feynmanText]);
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
      `}</style>

      {mode === "home" && (
        <Home
          dueCount={dueCount}
          streak={streak}
          completedToday={completedToday}
          cardData={cardData}
          setMode={setMode}
          setCurrentIdx={setCurrentIdx}
          setFlipped={setFlipped}
        />
      )}
      {mode === "flashcards" && (
        <FlashcardMode
          studyQueue={studyQueue}
          filterCat={filterCat}
          setFilterCat={setFilterCat}
          currentIdx={currentIdx}
          setCurrentIdx={setCurrentIdx}
          flipped={flipped}
          setFlipped={setFlipped}
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
        />
      )}
      {mode === "curriculum" && (
        <CurriculumMode
          setMode={setMode}
          cardData={cardData}
          setSelectedTopic={setSelectedTopic}
        />
      )}
    </div>
  );
}
