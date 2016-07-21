const reducer = (answers = [], action) => {
  switch (action.type) {
    case 'MARK_ANSWER_AS_RIGHT':
      const answer = answers[action.answerIndex];

      return [
        ...answers.slice(0, action.answerIndex),
        {
          ...answer,
          answered: 'right'
        },
        ...answers.slice(action.answerIndex + 1, answers.length)
      ]

    case 'FETCHING_PROBLEMS':
      switch (action.status) {
        case 'fetching':
          return []
        case 'success':
          return action.answers
        case 'failure':
          return []
      }
    default:
      return answers
  }
};

export { reducer };

