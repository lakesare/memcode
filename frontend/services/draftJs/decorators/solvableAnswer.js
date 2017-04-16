import React from 'react';

import { InputForAnswer } from '~/pages/courses_id_review/components/InputForAnswer';

const solvableAnswer = () => ({
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
    <InputForAnswerContainer {...props}/>
});

class InputForAnswerContainer extends React.Component {
  static propTypes = {
    contentState: React.PropTypes.object.isRequired,
    entityKey: React.PropTypes.string.isRequired,
  }

  // focus if it's the first answer
  getIfFirst = () =>
    // no idea how to do it without convertToRaw
    // const entities = convertToRaw(this.props.contentState).entityMap;
    // const firstAnswerKey = Object.keys(entities)
    //   .find((key) => entities[key].type === 'answer');

    // return firstAnswerKey === this.props.entityKey;

    // whatever, yay to dirty hacks
    this.props.entityKey === '1';

  getAnswer = () => {
    const entity = this.props.contentState.getEntity(this.props.entityKey);
    const answer = entity.getData().answer;
    return answer;
  }

  render = () =>
    <InputForAnswer answer={this.getAnswer()} ifFirst={this.getIfFirst()}/>;
}

export { solvableAnswer };
