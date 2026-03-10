// ─── LocalStorage Persistence ────────────────────────────────────────────────

const STORAGE_KEY = "ai-agents-mastery";

function getStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // quota exceeded — silently fail
  }
}

export function loadCardData() {
  return getStore().cardData || {};
}

export function saveCardData(cardData) {
  const store = getStore();
  store.cardData = cardData;
  setStore(store);
}

export function loadFeynmanTexts() {
  return getStore().feynmanTexts || {};
}

export function saveFeynmanTexts(texts) {
  const store = getStore();
  store.feynmanTexts = texts;
  setStore(store);
}

export function loadFeynmanScores() {
  return getStore().feynmanScores || {};
}

export function saveFeynmanScores(scores) {
  const store = getStore();
  store.feynmanScores = scores;
  setStore(store);
}

export function loadStats() {
  const store = getStore();
  const today = new Date().toDateString();
  if (store.statsDate !== today) {
    return { streak: store.stats?.streak || 0, completedToday: 0 };
  }
  return store.stats || { streak: 0, completedToday: 0 };
}

export function saveStats(stats) {
  const store = getStore();
  store.stats = stats;
  store.statsDate = new Date().toDateString();
  setStore(store);
}
