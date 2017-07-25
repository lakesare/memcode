const RichTextPlugin = () => ({
  onKeyDown: (event, data, state) => {
    if (event.which === 66 && data.isCtrl) {
      event.preventDefault();
      return state
        .transform()
        .toggleMark({ type: 'bold' })
        .apply();
    }
  },

  schema: {
    marks: {
      bold: props => <strong>{props.children}</strong>,
    }
  }
});

export { RichTextPlugin };
