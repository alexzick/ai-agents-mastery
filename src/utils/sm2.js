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

export function isDue(cardData) {
  if (!cardData?.nextReview) return true;
  return new Date(cardData.nextReview) <= new Date();
}

export function getCardStatus(cardData) {
  if (!cardData) return "new";
  if (new Date(cardData.nextReview) > new Date()) return "learned";
  return "due";
}
