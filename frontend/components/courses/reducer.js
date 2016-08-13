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
    case 'CREATE_COURSE':
      fetch("/api/courses", {
        method: 'POST',
        body: JSON.stringify(courseData),
        headers: new Headers({ "Content-Type": "application/json" })
      })
      .then(response => response.json() )
      .then((response) => {
        console.log(response)
      });
      return courses
    default:
      return courses
  }
};

export { reducer };