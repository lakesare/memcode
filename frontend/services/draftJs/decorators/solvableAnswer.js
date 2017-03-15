import React from 'react';

import { InputForAnswer } from '~/pages/courses_id_review/components/InputForAnswer';

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
    <InputForAnswerContainer {...props} onRightAnswerGiven={onRightAnswerGiven}/>
});

class InputForAnswerContainer extends React.Component {
  static propTypes = {
    contentState: React.PropTypes.object.isRequired,
    entityKey: React.PropTypes.string.isRequired,
    onRightAnswerGiven: React.PropTypes.func
  }

  static defaultProps = {
    onRightAnswerGiven: null
  }

  getAnswer = () => {
    const entity = this.props.contentState.getEntity(this.props.entityKey);
    const answer = entity.getData().answer;
    return answer;
  }

  render = () =>
    <InputForAnswer answer={this.getAnswer()} onRightAnswerGiven={this.props.onRightAnswerGiven}/>;
}

export { solvableAnswer };
