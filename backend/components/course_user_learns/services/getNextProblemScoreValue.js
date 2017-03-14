// easiness:float – A number ≥ 1.3 representing how easy the item is, with 1.3 being the hardest.  Defaults to 2.5
// consecutiveCorrectAnswers:int – How many times in a row the user has correctly answered this item
// nextDueDate:datetime – The next time this item needs to be reviewed

import { dateNDaysFromToday } from './dateNDaysFromToday';

// performanceRating: on a scale from 0-5 (0=worst, 5=best)
const getNextProblemScoreValue = (prevScoreValue, performanceRating) => {
  const nextEasiness = prevScoreValue.easiness +
    (-0.8) +
    (0.28 * performanceRating) +
    (0.02 * (performanceRating ** 2));

  const nextConsecutiveCorrectAnswers =
    isAnswerCorrect(performanceRating) ?
    prevScoreValue.consecutiveCorrectAnswers + 1 :
    0;

  const daysToWait = 6 * (nextEasiness ** (nextConsecutiveCorrectAnswers - 1));
  const nextNextDueDate =
    isAnswerCorrect(performanceRating) ?
    dateNDaysFromToday(daysToWait) :
    dateNDaysFromToday(1);

  const nextScoreValue = {
    easiness: nextEasiness,
    consecutiveCorrectAnswers: nextConsecutiveCorrectAnswers,
    nextDueDate: nextNextDueDate
  };

  return nextScoreValue;
};

const isAnswerCorrect = (performanceRating) => performanceRating > 4;

export { getNextProblemScoreValue };
