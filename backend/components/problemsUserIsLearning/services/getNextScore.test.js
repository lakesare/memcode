/* eslint-disable no-param-reassign */
import 'source-map-support/register';
import { expect } from 'chai';
import { getNextScore } from './getNextScore';
import { initialScore } from './initialScore';


describe('getNextScore', () => {
  it('all 5 rating', () => {
    const score = initialScore();
    const intervals = generateNReviews(score, 5, 10);

    expect(intervals).to.deep.equal([0, 1, 9, 23, 47, 83, 133, 200, 286, 300]);
  });

  it('all 4 ratings', () => {
    const score = initialScore();
    const intervals = generateNReviews(score, 4, 10);

    expect(intervals).to.deep.equal([0, 1, 7, 17, 31, 51, 77, 108, 145, 188]);
  });

  it('all 0 ratings', () => {
    const score = initialScore();
    const intervals = generateNReviews(score, 0, 10);

    expect(intervals).to.deep.equal([1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
  });

  it('different ratings', () => {
    const score = initialScore();
    const intervals = [];
    intervals.push(...generateNReviews(score, 5.0, 5));
    intervals.push(...generateNReviews(score, 3.0, 3));
    intervals.push(...generateNReviews(score, 4.0, 5));

    expect(intervals).to.deep.equal([0, 1, 9, 23, 47, 1, 1, 1, 0, 1, 7, 18, 34]);
  });
});

const generateNReviews = (score, performanceRating, n) => {
  const intervals = [];
  for (let i = 0; i < n; i++) {
    const nextScore = getNextScore(
      score.easiness,
      score.consecutiveCorrectAnswers,
      performanceRating
    );
    intervals.push(Math.floor(nextScore.daysToNextReview));
    score.easiness = nextScore.easiness;
    score.consecutiveCorrectAnswers = nextScore.consecutiveCorrectAnswers;
  }
  return intervals;
};
