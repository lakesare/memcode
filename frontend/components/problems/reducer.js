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

    default:
      return problems
  }
};

export { reducer };