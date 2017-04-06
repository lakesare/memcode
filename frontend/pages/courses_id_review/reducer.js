const initialState = {
  statusOfSolvingCurrentProblem: 'solving' // or 'succumbed'
};

// ___why is it not in local state?
// because of draftjs.
// it's easier to connect AnswerInput and Problem to the store
// than try and pass state from Problem to AnswerInput through draftjs's decorator
const Page_courses_id_review_Reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SUCCUMB':
      return { statusOfSolvingCurrentProblem: 'succumbed' };
    case 'SOLVE':
      return { statusOfSolvingCurrentProblem: 'solving' };
    default:
      return state;
  }
};

export { Page_courses_id_review_Reducer };
