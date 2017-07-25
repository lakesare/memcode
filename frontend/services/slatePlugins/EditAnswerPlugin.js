const EditAnswerPlugin = () => ({
  onKeyDown: (event, data, state) => {
    if (event.which === 13  && data.isCtrl) {
      event.preventDefault();
      // console.log(state.texts.toJS());
      const selectedText = state.texts.map((text) => text.text).join(' ');
      return state
        .transform()
        .insertInline(
          { type: 'answer', data: { answer: selectedText }, isVoid: true }
        )
        .apply();
    }
  },

  schema: {
    rules: [
      {
        match: (node) =>
          node.kind === 'inline' && node.type === 'answer',
        render: (props) => {
          const answer = props.node.get('data').get('answer');
          return <input value={answer}/>;
        }
      }
    ]
  }
});

export { EditAnswerPlugin };
