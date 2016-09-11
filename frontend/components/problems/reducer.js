import Immutable from 'immutable';

const initialState = {
  status: null,
  error:  null,
  items:  []
};

const reducer = (problems = initialState, action) => {
  problems = Immutable.fromJS(problems);
  switch (action.type) {
    case 'FETCHING_PROBLEMS':
      switch (action.status) {
        case 'fetching':
          return problems
            .set('status', 'fetching')
            .set('error', null)
            .set('items', [])
            .toJS()
        case 'success':
          return problems
            .set('status', 'success')
            .set('error', null)
            .set('items', action.problems)
            .toJS()
        case 'failure':
          return problems
            .set('status', 'failure')
            .set('error', action.error)
            .set('items', [])
            .toJS()
      }
    case 'MARK_ANSWER_AS_RIGHT': {
      const problemIndex = problems
        .get('items')
        .findIndex((problem) => problem.get('id') === action.problemId);
      const answerIndex = action.answerIndex;

      return problems
        .setIn(['items', problemIndex, 'content', 'answers', answerIndex, 'answered'], 'right')
        .toJS()
    }
    case 'DELETING_PROBLEM': {
      const problemIndex = problems
        .getIn(['items'])
        .findIndex((item) => item.get('id') === action.problemId)
      switch (action.status) {
        case 'fetching':
          return problems
            .setIn(['items', problemIndex, 'delete', 'status'], 'fetching')
            .toJS()
        case 'success':
          return problems
            .removeIn(['items', problemIndex])
            .toJS()
        case 'failure':
          return problems
            .setIn(['items', problemIndex, 'delete', 'status'], 'failure')
            .setIn(['items', problemIndex, 'delete', 'error'], action.error)
            .toJS()
      }
    }
    default:
      return problems.toJS()
  }
};



export { reducer };