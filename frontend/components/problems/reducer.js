
const reducer = (problems = {
  status: null,
  error: null,
  items: []
}, action) => {
  switch (action.type) {
    case 'FETCHING_PROBLEM':
      return problems
    default:
      return problems
  }
};

export { reducer };




