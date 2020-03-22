
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
    } else if (due.nextDueDate > problem.nextDueDate) {
      due = problem;
    }
  });
  return due;
};

export default {
  isProblemToReview, isProblemToLearn,
  getDtosToLearn, countAllProblemsToLearn,
  getDtosToReview, countAllProblemsToReview,
  sortByHowMuchToDo,
  getNextDueProblem
};
