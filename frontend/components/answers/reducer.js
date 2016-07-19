const reducer = (answers = [], action) => {
  switch (action.type) {
    case 'MARK_ANSWER_AS_RIGHT':
      console.log('marking')
      console.log(answers)
      const answerIndex = answers.findIndex( (answer) => answer.id == action.id );
      const answer = answers[answerIndex];

      return [
        ...answers.slice(0, answerIndex),
        {
          ...answer,
          answered: 'right'
        },
        ...answers.slice(answerIndex + 1, answers.length)
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

