// ─── SM-2 Spaced Repetition Algorithm ───────────────────────────────────────
// SuperMemo 2 algorithm for scheduling flashcard reviews.
// Quality: 0 = blackout, 1 = wrong, 2 = hard, 3 = good, 4 = easy, 5 = perfect

export function sm2(card, quality) {
  let { easeFactor = 2.5, interval = 1, repetitions = 0 } = card;

  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
    easeFactor = Math.max(
      1.3,
      easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
    );
  } else {
    repetitions = 0;
    interval = 1;
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    easeFactor,
    interval,
    repetitions,
    nextReview: nextReview.toISOString(),
    lastQuality: quality,
  };
}

export function isDue(card, topicMasteryData) {
  // If we have forgetting curve data, use retention threshold
  if (topicMasteryData && topicMasteryData.lastReviewDate) {
    const daysSince = (Date.now() - new Date(topicMasteryData.lastReviewDate).getTime()) / 86400000;
    const S = topicMasteryData.stability || 1;
    const retention = Math.exp(-daysSince / S);
    return retention < 0.5;
  }
  // Fallback to original SM-2 logic
  if (!card || !card.nextReview) return true;
  return new Date(card.nextReview) <= new Date();
}

export function getCardStatus(cardData, topicMasteryData) {
  if (!cardData) return "new";
  if (isDue(cardData, topicMasteryData)) return "due";
  return "learned";
}
