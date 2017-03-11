import React from 'react';

import { Answer } from '~/pages/courses_id_solve/components/Answer';

const solvableAnswer = (onRightAnswerGiven) => ({
  strategy: (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        if (entityKey === null) return false;
        return contentState.getEntity(entityKey).getType() === 'answer';
      },
      callback
    );
  },
  component: (props) =>
    <Answer answer={props.decoratedText} onRightAnswerGiven={onRightAnswerGiven}/>
});

export { solvableAnswer };
