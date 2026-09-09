import test from 'node:test';
import assert from 'node:assert/strict';

import repetitions from './repetitions.js';

const HOURS = 24;
const H = 60 * 60 * 1000;
const DAY = 24 * H;
const NOW = new Date('2026-09-01T12:00:00.000Z').getTime();

const deck = (amount, dueAt) =>
  Array.from({ length: amount }, (_, index) => ({ id: index + 1, nextDueDate: new Date(dueAt) }));

const review = (problems, problem, now) => {
  problem.nextDueDate = repetitions.nextDueDateAfterReview(problems, problem, HOURS, now);
};

const reviewWholePass = (problems, now) =>
  repetitions.problemsDueNow(problems, HOURS, now).forEach((problem) => review(problems, problem, now));

const amountDue = (problems, now) => repetitions.problemsDueNow(problems, HOURS, now).length;
const repetitionsDue = (problems, now) => repetitions.countRepetitionsDue(problems, HOURS, now);
const earliestDueDate = (problems) => Math.min(...problems.map((one) => new Date(one.nextDueDate).getTime()));

test('a spaced repetition course owes no repetitions', () => {
  assert.equal(repetitions.countRepetitionsDue(deck(3, NOW - DAY), null, NOW), null);
});

test('the count shrinks with every flashcard reviewed', () => {
  const problems = deck(3, NOW - 1 * H);
  assert.equal(amountDue(problems, NOW), 3);

  review(problems, problems[0], NOW);
  assert.equal(amountDue(problems, NOW), 2);

  review(problems, problems[1], NOW);
  assert.equal(amountDue(problems, NOW), 1);

  review(problems, problems[2], NOW);
  assert.equal(amountDue(problems, NOW), 0);
  assert.equal(repetitionsDue(problems, NOW), 0);
});

// [claude comment] the whole point of moving on by one interval rather than to now + one interval
test('repetitions slept through pile up, and one pass pays off exactly one of them', () => {
  const problems = deck(3, NOW - 3 * DAY);
  assert.equal(repetitionsDue(problems, NOW), 4);

  reviewWholePass(problems, NOW);
  assert.equal(repetitionsDue(problems, NOW), 3);
  assert.equal(amountDue(problems, NOW), 3, 'the whole course is owed again');
});

test('a half-finished pass owes only what is left of it', () => {
  const problems = deck(4, NOW - 1 * H);

  review(problems, problems[0], NOW);
  review(problems, problems[1], NOW);
  assert.equal(amountDue(problems, NOW), 2);
  assert.equal(repetitionsDue(problems, NOW), 1, 'the repetition is still owed');
});

test('catching up takes exactly as many passes as were owed, and ends grid-locked', () => {
  const problems = deck(2, NOW - 3 * DAY);
  const owed = repetitionsDue(problems, NOW);

  let now = NOW;
  let passes = 0;
  while (repetitionsDue(problems, now) > 0) {
    reviewWholePass(problems, now);
    now += 5 * 60 * 1000; // [claude comment] every pass takes the user five minutes
    passes += 1;
    assert.ok(passes <= owed, 'catching up must not run away');
  }

  assert.equal(passes, owed);
  assert.equal(
    new Date(earliestDueDate(problems)).toISOString(),
    '2026-09-02T12:00:00.000Z',
    'back on the original grid, no drift from the time of day the user caught up'
  );
});

test('a course left alone for a year owes at most the cap, and still counts down', () => {
  const problems = deck(2, NOW - 365 * DAY);

  const counted = [];
  let now = NOW;
  for (let pass = 0; pass < 3; pass += 1) {
    counted.push(repetitionsDue(problems, now));
    reviewWholePass(problems, now);
    now += 60 * 1000;
  }

  assert.deepEqual(counted, [repetitions.MAX_REPETITIONS_DUE, 9, 8]);
});

test('a flashcard learned mid-cycle is reviewable right away, then joins the batch', () => {
  const problems = deck(3, NOW + 5 * H);
  const justLearned = { id: 99, nextDueDate: new Date(NOW) };
  problems.push(justLearned);

  assert.equal(amountDue(problems, NOW), 1, 'only the new flashcard, the deck is not due yet');

  review(problems, justLearned, NOW);
  assert.equal(
    new Date(justLearned.nextDueDate).getTime(),
    NOW + 5 * H,
    'rejoins the deck instead of drifting off on a schedule of one'
  );
  assert.equal(amountDue(problems, NOW + 6 * H), 4, 'the whole course comes due together');
});

test('flashcards reviewed in separate sittings resync onto one batch', () => {
  const problems = deck(4, NOW - 1 * H);

  review(problems, problems[0], NOW);
  review(problems, problems[1], NOW);

  const nextSitting = NOW + 20 * H;
  review(problems, problems[2], nextSitting);
  review(problems, problems[3], nextSitting);

  assert.equal(new Set(problems.map((one) => new Date(one.nextDueDate).getTime())).size, 1);
});

test('reviewing ahead of time leaves the schedule where it was', () => {
  const problems = deck(3, NOW + 5 * H);

  review(problems, problems[0], NOW);

  assert.equal(new Date(problems[0].nextDueDate).getTime(), NOW + 5 * H);
});

test('the next repetition lands on the following cycle boundary, however late the user is', () => {
  assert.equal(
    repetitions.nextRepetitionAt(deck(3, NOW - 4 * H), HOURS, NOW).getTime(),
    NOW + 20 * H,
    'fell due four hours ago on a daily schedule, so it is back in twenty'
  );

  assert.equal(
    repetitions.nextRepetitionAt(deck(3, NOW + 5 * H), HOURS, NOW).getTime(),
    NOW + 5 * H,
    'not due yet, so that is the arrival'
  );

  assert.equal(
    repetitions.nextRepetitionAt(deck(3, NOW - 3 * DAY - 4 * H), HOURS, NOW).getTime(),
    NOW + 20 * H,
    'days behind, still counts down to the next boundary rather than the first one missed'
  );

  assert.equal(repetitions.nextRepetitionAt([], HOURS, NOW), null);
});
