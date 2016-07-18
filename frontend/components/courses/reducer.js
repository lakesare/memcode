
const reducer = (courses = {
  status: null,
  error: null,
  items: []
}, action) => {
  switch (action.type) {
    case 'FETCHING_COURSES':
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
            items: action.items
          }
        case 'failure':
          return courses
      }

    default:
      return courses
  }
};

export { reducer };