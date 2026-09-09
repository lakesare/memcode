import dayjs from 'dayjs';
import repetitions from '~/../services/repetitions';

const getLearnedProblems = (dto) =>
  dto.problems.filter((problem) => problem._learned && !problem.ifIgnored);

// [claude comment] null = not a fixed-interval course (services/repetitions.js)
const countRepetitionsDue = (dto) =>
  repetitions.countRepetitionsDue(getLearnedProblems(dto), dto.repeatEveryHours);

// [claude comment] a fixed-interval course comes due as one batch, so what's left to review is the earliest batch of overdue flashcards - reviewing one takes it out of the count
const getProblemsToReview = (dto) =>
  dto.repeatEveryHours ?
    repetitions.problemsDueNow(getLearnedProblems(dto), dto.repeatEveryHours) :
    dto.problems.filter(isProblemToReview);

const dateToDueIn = (date) => {
  const string = dayjs(date).from(dayjs(), true);
  const [amount, measure] = string.split(' ');
  if (string === 'a few seconds') {
    return { amount: '', measure: 'a few seconds' };
  }
  return { amount: (amount === 'a' || amount === 'an') ? 1 : amount, measure };
};

// [claude comment] when the review pile next grows - a fixed-interval course arrives whole on its next cycle boundary, a spaced repetition one whenever its soonest not-yet-due flashcard comes round. null = nothing more is coming, which for spaced repetition means everything is already waiting
const getNextArrivalAt = (dto) => {
  const learnedProblems = getLearnedProblems(dto);

  if (dto.repeatEveryHours) {
    return repetitions.nextRepetitionAt(learnedProblems, dto.repeatEveryHours);
  }

  const now = Date.now();
  const upcoming = learnedProblems
    .map((problem) => new Date(problem.nextDueDate).getTime())
    .filter((time) => time > now);

  return upcoming.length ? new Date(Math.min(...upcoming)) : null;
};

// => null
// => { amount: 5, measure: 'hours' }
const getNextDueDateIn = (dto) => {
  const nextArrivalAt = getNextArrivalAt(dto);

  return nextArrivalAt ? dateToDueIn(nextArrivalAt) : null;
};

const nextDueDateInToString = (nextDueDateIn) =>
  nextDueDateIn ? `In ${nextDueDateIn.amount} ${nextDueDateIn.measure}` : null;

const isProblemToReview = (problem) => {
  if (!problem._learned || problem.ifIgnored) return false;

  const nowInUtc = new Date().getTime();
  const dueTime = new Date(problem.nextDueDate).getTime();
  const ifReadyForReview = dueTime < nowInUtc;

  return ifReadyForReview;
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
    getProblemsToReview(course).length > 0
  );
};

const countAllProblemsToReview = (dtos) => {
  return dtos.reduce((acc, course) => {
    return acc + getProblemsToReview(course).length;
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
    } else if (due.nextDueDate > problem.nextDueDate) {
      due = problem;
    }
  });
  return due;
};

const dtoToCourseCardProps = (dto) => {
  const nextDueProblem = getNextDueProblem(dto);
  const problemsToLearn = dto.problems.filter(isProblemToLearn);
  const problemsToReview = getProblemsToReview(dto);

  return {
    ...dto,
    amountOfProblemsToLearn: problemsToLearn.length,
    amountOfProblemsToReview: problemsToReview.length,
    repetitionsDue: countRepetitionsDue(dto),
    nextDueDate: nextDueProblem ? nextDueProblem.nextDueDate : null,
  };
};

const filterCoursesByFocus = (courses, focusedCategoryId, focusedSubstring) => {
  // If substring is active, only apply substring filter (categories disabled)
  if (focusedSubstring && focusedSubstring.trim() !== '') {
    return courses.filter((course) => {
      const courseTitle = course.course ? course.course.title : course.title;
      return courseTitle.toLowerCase().startsWith(focusedSubstring.toLowerCase());
    });
  }
  
  // Otherwise apply category filter
  if (focusedCategoryId) {
    return courses.filter((course) => {
      const categoryId = course.courseCategory ? course.courseCategory.id : null;
      return categoryId === focusedCategoryId;
    });
  }
  
  // No filtering active
  return courses;
};

export default {
  isProblemToReview, isProblemToLearn,
  countRepetitionsDue, getProblemsToReview,
  getDtosToLearn, countAllProblemsToLearn,
  getDtosToReview, countAllProblemsToReview,
  sortByHowMuchToDo,
  getNextDueProblem,
  getNextDueDateIn,
  nextDueDateInToString,
  dtoToCourseCardProps,
  filterCoursesByFocus,
};
