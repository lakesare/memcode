import Immutable from 'immutable';
const initialState = {
  courses: {
    status: null,
    error:  null,
    items:  []
  }, 
  course: {
    status: null,
    error:  null,
    items:  {}
  }
};

const reducer = (courses = initialState, action) => {
  courses = Immutable.fromJS(courses);
  switch (action.type) {
    case 'FETCHING_COURSES':
      switch (action.status) {
        case 'fetching':
          return courses
            .setIn(['courses', 'status'], 'fetching')
            .setIn(['courses', 'error'], null)
            .setIn(['courses', 'items'], [])
            .toJS()
        case 'success':
          return courses
            .setIn(['courses', 'status'], 'success')
            .setIn(['courses', 'error'], null)
            .setIn(['courses', 'items'], action.items)
            .toJS()
        case 'failure':
          return courses
            .setIn(['courses', 'status'], 'failure')
            .setIn(['courses', 'error'], action.error)
            .setIn(['courses', 'items'], [])
            .toJS()
      }
    case 'FETCHING_COURSE':
      switch (action.status) {
        case 'fetching':
          return courses
            .setIn(['course', 'status'], 'fetching')
            .setIn(['course', 'error'], null)
            .setIn(['course', 'items'], {})
            .toJS()
        case 'success':
          return courses
            .setIn(['course', 'status'], 'success')
            .setIn(['course', 'error'], null)
            .setIn(['course', 'items'], action.course)
            .toJS()
        case 'failure':
          return courses
            .setIn(['course', 'status'], 'failure')
            .setIn(['course', 'error'], null)
            .setIn(['course', 'items'], {})
            .toJS()
      }
    case 'CREATING_COURSE':
      switch (action.status) {
        case 'fetching':
          return courses
            .setIn(['course', 'status'], 'fetching')
            .setIn(['course', 'error'], null)
            .setIn(['course', 'items'], {})
            .toJS()
        case 'success':
          return courses
            .setIn(['course', 'status'], 'success')
            .setIn(['course', 'error'], null)
            .setIn(['course', 'items'], {})
            .toJS()
        case 'failure':
          return courses
            .setIn(['course', 'status'], 'failure')
            .setIn(['course', 'error'], action.error)
            .setIn(['course', 'items'], {})
            .toJS()
      }
    case 'DELETING_COURSE':
      const courseIndex = courses
        .getIn(['courses', 'items'])
        .findIndex((item) => item.get('id') === action.courseId)
      switch (action.status) {
        case 'fetching':

          return courses
            .setIn(['courses', 'items', courseIndex, 'delete', 'status'], 'fetching')
            .toJS()
        case 'success':
          return courses
            .setIn(['courses', 'items', courseIndex, 'delete', 'status'], 'success')
            .toJS()
        case 'failure':
          return courses
            .setIn(['courses', 'items', courseIndex, 'delete', 'status'], 'failure')
            .setIn(['courses', 'items', courseIndex, 'delete', 'error'], action.error)
            .toJS()
      }
    default:
      return courses.toJS()
  }
};

export { reducer };