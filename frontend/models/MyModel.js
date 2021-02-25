import dayjs from 'dayjs';

// => null
// => 'now'
// => { amount: 5, measure: 'hours' }
const getNextDueDateIn = (dto) => {
  const nextDueProblem = getNextDueProblem(dto);
  if (!nextDueProblem) return null;

  if (isProblemToReview(nextDueProblem)) {
    return 'now';
  }

  const string = dayjs(nextDueProblem.nextDueDate).from(dayjs(), true);
  const [amount, measure] = string.split(' ');
  if (string === 'a few seconds') {
    return { amount: '', measure: 'a few seconds' };
  }
  return { amount: (amount === 'a' || amount === 'an') ? 1 : amount, measure };
};

const nextDueDateInToString = (nextDueDateIn) => {
  if (nextDueDateIn === null) {
    return null;
  } else if (nextDueDateIn === 'now') {
    return 'Now';
  } else {
    return `In ${nextDueDateIn.amount} ${nextDueDateIn.measure}`;
  }
};

const isProblemToReview = (problem) => {
  if (!problem._learned || problem.ifIgnored) return false;
  return dayjs(problem.nextDueDate).isBefore(dayjs());
};

const isProblemToLearn = (problem) => {
  return !problem._learned;
};

const getDtosToLearn = (dtos) => {
  return dtos.filter((course) =>
    course.problems.find(isProblemToLearn)
  );
};

const countAllProblemsToLearn = (dtos) => {
  return dtos.reduce((acc, course) => {
    return acc + course.problems.filter(isProblemToLearn).length;
  }, 0);
};

const getDtosToReview = (dtos) => {
  return dtos.filter((course) =>
    course.problems.find(isProblemToReview)
  );
};

const countAllProblemsToReview = (dtos) => {
  return dtos.reduce((acc, course) => {
    return acc + course.problems.filter(isProblemToReview).length;
  }, 0);
};

const sortByHowMuchToDo = (dtos) => {
  dtos.sort((a, b) => {
    if (a.amountOfProblemsToReview > b.amountOfProblemsToReview) {
      return -1;
    } else if (a.amountOfProblemsToReview < b.amountOfProblemsToReview) {
      return 1;
    } else {
      if (a.amountOfProblemsToLearn > b.amountOfProblemsToLearn) {
        return -1;
      } else if (a.amountOfProblemsToLearn < b.amountOfProblemsToLearn) {
        return 1;
      } else {
        if (a.nextDueDate && b.nextDueDate) {
          if (a.nextDueDate < b.nextDueDate) {
            return -1;
          } else if (a.nextDueDate > b.nextDueDate) {
            return 1;
          } else {
            return 0;
          }
        } else if (a.nextDueDate && !b.nextDueDate) {
          return -1;
        } else if (!a.nextDueDate && b.nextDueDate) {
          return 1;
        } else {
          return 0;
        }
      }
    }
  });
  return dtos;
};

const getNextDueProblem = (dto) => {
  let due = null;
  dto.problems.forEach((problem) => {
    if (!problem._learned || problem.ifIgnored) return;

    if (!due) {
      due = problem;
    } else if (dayjs(problem.nextDueDate).isBefore(due.nextDueDate)) {
      due = problem;
    }
  });
  return due;
};

const dateToAmountAndMeasure = (nextDueDate) => {
  const string = dayjs(nextDueDate).from(dayjs(), true);

  if (string === 'a few seconds') {
    return 'a few seconds';
  }

  const [amount, measure] = string.split(' ');
  return `${(amount === 'a' || amount === 'an') ? 1 : amount} ${measure}`;
};

// If nothing to review yet (closest due problem is in the future) - return 'review in 20 hours'
// If we already have problems to review, but we have more soon - return 'more in 3 hours'
const getMoreIn = (dto) => {
  let ifAlreadyDue = false;
  let nextToReview = null;

  const now = dayjs();

  dto.problems.forEach((problem) => {
    if (!problem._learned || problem.ifIgnored) return;

    // Is flashcard already due?
    if (dayjs(problem.nextDueDate).isBefore(now)) {
      ifAlreadyDue = true;
    // Is flashcard not yet due, but will be due in the future?
    } else {
      if (!nextToReview || dayjs(problem.nextDueDate).isBefore(nextToReview.nextDueDate)) {
        nextToReview = problem;
      }
    }
  });

  if (ifAlreadyDue && nextToReview) {
    return `More in ${dateToAmountAndMeasure(nextToReview.nextDueDate)}`;
  } else if (ifAlreadyDue && !nextToReview) {
    return 'Review now';
  } else if (!ifAlreadyDue && nextToReview) {
    return `Review in ${dateToAmountAndMeasure(nextToReview.nextDueDate)}`;
  } else if (!ifAlreadyDue && !nextToReview) {
    return null;
  }
};

const dtoToCourseCardProps = (dto) => {
  const nextDueProblem = getNextDueProblem(dto);
  const problemsToLearn = dto.problems.filter(isProblemToLearn);
  const problemsToReview = dto.problems.filter(isProblemToReview);

  return {
    ...dto,
    amountOfProblemsToLearn: problemsToLearn.length,
    amountOfProblemsToReview: problemsToReview.length,
    nextDueDate: nextDueProblem ? nextDueProblem.nextDueDate : null,
  };
};

export default {
  isProblemToReview, isProblemToLearn,
  getDtosToLearn, countAllProblemsToLearn,
  getDtosToReview, countAllProblemsToReview,
  sortByHowMuchToDo,
  getNextDueProblem,
  getNextDueDateIn,
  nextDueDateInToString,
  dtoToCourseCardProps,
  getMoreIn
};
