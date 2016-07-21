import { answersReducer } from '../answers';
const reducer = (problems = {
  status: null,
  error: null,
  items: []
}, action) => {
  switch (action.type) {
    case 'FETCHING_PROBLEMS':
      switch (action.status) {
        case 'fetching':
          return {
            status: 'fetching',
            error: null,
            items: []
          }
        case 'success':
          return {
            status: 'success',
            error: null,
            items: action.problems
          }
        case 'failure':
          return {
            status: 'failure',
            error: 'TODO',
            items: []
          }
      }
    case 'MARK_ANSWER_AS_RIGHT':
      console.log(problems)
      const problemIndex = problems.items.findIndex((problem) => problem.id === action.problemId);
      const problem = problems.items[problemIndex];
      return {
        ...problems,
        items: [
          ...problems.items.slice(0, problemIndex),
          {
            ...problem,
            content: answersReducer(problem.content, action)
          },
          ...problems.items.slice(problemIndex + 1, problems.length)
        ]
      }
    default:
      return problems
  }
};

export { reducer };