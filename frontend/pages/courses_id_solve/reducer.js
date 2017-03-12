const initialState = {
  statusOfSolvingCurrentProblem: 'solving' // or 'succumbedAfterSolving'
};

// ___why is it not in local state?
// because of draftjs.
// it's easier to connect AnswerInput and Problem to the store
// than try and pass state from Problem to AnswerInput through draftjs's decorator
const page_courses_id_solve_reducer = (pageState = initialState, action) => {
  switch (action.type) {
    case 'SUCCUMB':
      return { statusOfSolvingCurrentProblem: 'succumbedAfterSolving' };
    case 'SOLVE':
      return { statusOfSolvingCurrentProblem: 'solving' };
    default:
      return pageState;
  }
};

export { page_courses_id_solve_reducer };
