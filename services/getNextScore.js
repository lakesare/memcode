// ___why not use original method?
// (http://www.blueraja.com/blog/477/a-better-spaced-repetition-learning-algorithm-sm2)
// original method resolves into intervals too harsh:
//
// { days: 6 },
// { days: 10 },
// { days: 30 },
// { days: 99 },
// { days: 339 },
// { days: 1231 },
// { days: 4724 },
// { days: 19128 },
// { days: 24428 }

// memrise
//
// 4 hours, 12 hours, 1 day, 6 days, 12 days, 24 days, 48 days, 96 days, 180 days

// mine
// [ PostgresInterval { hours: 4, minutes: 48 },
//   PostgresInterval { days: 1, hours: 10, minutes: 59, seconds: 31 },
//   PostgresInterval { days: 4, hours: 19, minutes: 32, seconds: 9 },
//   PostgresInterval { days: 8, hours: 20, minutes: 47, seconds: 2 },
//   PostgresInterval { days: 13, hours: 15, minutes: 53, seconds: 16 },
//   PostgresInterval { days: 19, hours: 6 },
//   PostgresInterval { days: 25, hours: 16, minutes: 16, seconds: 19 },
//   PostgresInterval { days: 32, hours: 23, minutes: 51, seconds: 21 },
//   PostgresInterval { days: 41, hours: 5, minutes: 54, seconds: 14 },
//   PostgresInterval { days: 50, hours: 11, minutes: 34, seconds: 4 },
//   PostgresInterval { days: 60, hours: 18 } ]
//
// http://making.duolingo.com/how-we-learn-how-you-learn - what duolingo uses, may be interesting.

// performanceRating: on a scale from 0-5 (0=worst, 5=best)
// 0.28
const getNextScore = (prevEasiness, prevConsecutiveCorrectAnswers, performanceRating) => {
  const nextEasiness = clipEasiness(
    prevEasiness +
    (-0.8) +
    (0.28 * performanceRating) +
    (-0.02 * (performanceRating ** 2))
  );

  const nextConsecutiveCorrectAnswers =
    isAnswerCorrect(performanceRating) ?
      prevConsecutiveCorrectAnswers + 1 :
      0;

  const daysToNextReview = clipDaysToNextReview(
    isAnswerCorrect(performanceRating) ?
      // 6 * (nextEasiness ** (nextConsecutiveCorrectAnswers - 1)) :
      0.2 + (0.2 * ((nextEasiness ** 2.2) * ((nextConsecutiveCorrectAnswers - 1) ** 2.2))) :
      0.2 // otherwise review it in 4 hours
  );

  return {
    easiness: nextEasiness,
    consecutiveCorrectAnswers: nextConsecutiveCorrectAnswers,
    msToNextReview: daysToNextReview * 86400000
  };
};

const isAnswerCorrect = (performanceRating) => performanceRating >= 4;

// easiness must be >= 1.3
// if it's smaller - make it 1.3
const clipEasiness = (easiness) => Math.max(easiness, 1.3);

const clipDaysToNextReview = (days) => Math.min(days, 300);

export default getNextScore;
