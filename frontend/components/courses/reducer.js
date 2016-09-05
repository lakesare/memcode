
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
    case 'CREATING_COURSE':
      switch (action.status) {
        case 'fetching':
          console.log('fetching')
          break;
        case 'success':
          console.log('success');
          break;
        case 'failure':
          console.log(action.error)
          break;
      }
      return courses
    default:
      return courses
  }
};

export { reducer };