const editableAnswer = () => ({
  strategy: (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        if (entityKey === null) return false;
        const entity = contentState.getEntity(entityKey);
        return entity.getType() === 'answer';
      },
      callback
    );
  },

  component: (props) =>
    <span className="editableAnswer">{props.children}</span>
});

export { editableAnswer };
