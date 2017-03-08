import React from 'react';

const strategy = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      if (entityKey === null) return false;
      return contentState.getEntity(entityKey).getType() === 'answer';
    },
    callback
  );
};

const component = (props) =>
  <span className="answer">{props.children}</span>;

const answer = { strategy, component };

export { answer };
