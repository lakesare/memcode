// [claude comment] fixed-interval mode: the whole course comes due at once every N hours, and nextDueDate carries the entire schedule - a review moves a flashcard on by exactly ONE interval from where it already stood (so repetitions slept through pile up rather than quietly vanishing), and only the earliest batch of overdue flashcards counts as due right now (so a flashcard leaves the count the moment it's reviewed, even mid-catch-up)

const MAX_REPETITIONS_DUE = 10;

const intervalMs = (repeatEveryHours) => repeatEveryHours * 60 * 60 * 1000;

const dueTime = (problem) => new Date(problem.nextDueDate).getTime();

const earliestDueTime = (problems) =>
  problems.length ? Math.min(...problems.map(dueTime)) : null;

// [claude comment] everything scheduled within one interval of the earliest overdue flashcard belongs to the same pass - reviewing one moves it a full interval on, out of the batch
const problemsDueNow = (problems, repeatEveryHours, now = Date.now()) => {
  const due = problems.filter((problem) => dueTime(problem) <= now);

  const earliest = earliestDueTime(due);
  if (earliest === null) return [];

  return due.filter((problem) => dueTime(problem) < earliest + intervalMs(repeatEveryHours));
};

// [claude comment] how many times the whole course still has to be gone through to catch up. null = not a fixed-interval course
const countRepetitionsDue = (problems, repeatEveryHours, now = Date.now()) => {
  if (!repeatEveryHours) return null;

  const earliest = earliestDueTime(problems);
  if (earliest === null || earliest > now) return 0;

  return Math.min(
    Math.floor((now - earliest) / intervalMs(repeatEveryHours)) + 1,
    MAX_REPETITIONS_DUE
  );
};

// [claude comment] when the course next comes due - its own due date if it hasn't arrived yet, otherwise the next cycle boundary, so a deck that fell due four hours ago on a daily schedule is back in twenty
const nextRepetitionAt = (problems, repeatEveryHours, now = Date.now()) => {
  const earliest = earliestDueTime(problems);
  if (earliest === null) return null;
  if (earliest > now) return new Date(earliest);

  const interval = intervalMs(repeatEveryHours);
  const cyclesPassed = Math.floor((now - earliest) / interval) + 1;

  return new Date(earliest + (cyclesPassed * interval));
};

// [claude comment] one interval on from where the flashcard already stood, so a repetition slept through leaves it overdue still, and owed again on the next pass
const nextDueDateAfterReview = (problems, problem, repeatEveryHours, now = Date.now()) => {
  const interval = intervalMs(repeatEveryHours);

  // [claude comment] clipped, or a course left alone for a year would owe 365 passes to catch up. one short of the maximum, so that clipped-away repetitions can't be paid off invisibly - the counter has to move on every pass
  const oldestMeaningfulDueDate = now - ((MAX_REPETITIONS_DUE - 1) * interval);
  const caughtUpTo = Math.min(dueTime(problem), now);
  const candidate = Math.max(caughtUpTo, oldestMeaningfulDueDate) + interval;

  // [claude comment] rejoin the rest of the course instead of drifting off on a schedule of one. this is also what leaves a flashcard reviewed ahead of time where it was, and what lets one learned mid-cycle catch up with the batch on its first review
  const batch = problems
    .map(dueTime)
    .filter((time) => time > now && time <= candidate)
    .sort((a, b) => a - b)[0];

  return new Date(batch === undefined ? candidate : batch);
};

const parseRepeatEveryHours = (value) => {
  const hours = Number.parseInt(value, 10);
  if (Number.isNaN(hours) || hours <= 0) return null;

  return hours;
};

export default {
  problemsDueNow,
  countRepetitionsDue,
  nextRepetitionAt,
  nextDueDateAfterReview,
  parseRepeatEveryHours,
  MAX_REPETITIONS_DUE
};
