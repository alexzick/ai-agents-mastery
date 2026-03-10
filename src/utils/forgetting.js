// ─── Ebbinghaus Forgetting Curve Engine ─────────────────────────────────────
// R = e^(-t/S) where R = retention, t = days since review, S = stability
//
// Stability grows with each successful recall:
//   Perfect (quality 5): S × 2.5
//   Good (quality 3-4):  S × 1.8
//   Fail (quality < 3):  S resets to 1.0
//
// Mastery = 0.4×retention + 0.3×feynmanMastery + 0.3×flashcardAccuracy

/**
 * Calculate current retention probability for a topic.
 * @param {object} topicData - { lastReviewDate, stability }
 * @returns {number} Retention between 0.0 and 1.0
 */
export function getRetention(topicData) {
  if (!topicData || !topicData.lastReviewDate) return 0;
  const daysSince =
    (Date.now() - new Date(topicData.lastReviewDate).getTime()) / 86400000;
  const S = topicData.stability || 1;
  return Math.exp(-daysSince / S);
}

/**
 * Update memory stability after a review.
 * @param {number} currentS - Current stability value
 * @param {number} quality - 0-5 scale (flashcard) or mapped from Feynman 1-10
 * @returns {number} New stability value
 */
export function updateStability(currentS, quality) {
  const S = currentS || 1;
  if (quality >= 5) return S * 2.5; // Perfect
  if (quality >= 3) return S * (1 + 0.3 * quality); // Good: 1.9x to 2.2x
  return 1.0; // Fail: reset
}

/**
 * Map a Feynman score (1-10) to the 0-5 quality scale used by the forgetting curve.
 * @param {number} feynmanScore - Score from 1-10
 * @returns {number} Quality from 0-5
 */
export function feynmanToQuality(feynmanScore) {
  if (feynmanScore >= 9) return 5;
  if (feynmanScore >= 7) return 4;
  if (feynmanScore >= 5) return 3;
  if (feynmanScore >= 3) return 2;
  return 0;
}

/**
 * Calculate composite mastery for a topic.
 * mastery = 0.4×retention + 0.3×feynmanMastery + 0.3×flashcardAccuracy
 * @param {object} topicData - Full topic mastery data from storage
 * @returns {number} Mastery between 0.0 and 1.0
 */
export function getMastery(topicData) {
  if (!topicData) return 0;

  const retention = getRetention(topicData);
  const feynmanMastery = (topicData.feynmanHighScore || 0) / 10;

  // Flashcard accuracy from last 5 attempts
  const history = topicData.flashcardHistory || [];
  const recent = history.slice(-5);
  const flashcardAccuracy =
    recent.length > 0
      ? recent.filter((h) => h.correct).length / recent.length
      : 0;

  return 0.4 * retention + 0.3 * feynmanMastery + 0.3 * flashcardAccuracy;
}

/**
 * Get a color for a mastery/retention value.
 * @param {number} value - 0.0 to 1.0
 * @returns {string} Hex color
 */
export function getMasteryColor(value) {
  if (value >= 0.8) return "#22c55e"; // green
  if (value >= 0.6) return "#64ffda"; // teal
  if (value >= 0.4) return "#f59e0b"; // amber
  if (value >= 0.2) return "#f97316"; // orange
  return "#ef4444"; // red
}

/**
 * Check if a topic is due for review (retention dropped below threshold).
 * @param {object} topicData - Topic mastery data
 * @param {number} threshold - Retention threshold (default 0.5)
 * @returns {boolean}
 */
export function isDueForReview(topicData, threshold = 0.5) {
  if (!topicData || !topicData.lastReviewDate) return true; // never reviewed
  return getRetention(topicData) < threshold;
}

/**
 * Get urgency score for sorting (lower retention = higher urgency).
 * Never-reviewed topics get urgency 1.0 (highest).
 * @param {object} topicData
 * @returns {number} 0.0 (no urgency) to 1.0 (maximum urgency)
 */
export function getUrgency(topicData) {
  if (!topicData || !topicData.lastReviewDate) return 1.0;
  return 1.0 - getRetention(topicData);
}
