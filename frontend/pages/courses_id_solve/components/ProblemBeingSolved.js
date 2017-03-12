import React from 'react';

import { EditorState, convertFromRaw } from 'draft-js';

import { Problem } from '~/components/Problem';

class ProblemBeingSolved extends React.Component {
  static propTypes = {
    problem: React.PropTypes.object.isRequired,
    onRightAnswerGivenFn: React.PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { speUpdateProblem: {} };
  }

  createEditorState = (raw) =>
    EditorState.createWithContent(convertFromRaw(raw));

  render = () =>
    <Problem
      mode={'solving'}
      onRightAnswerGivenFn={this.props.onRightAnswerGivenFn}
      initialContentEditorState={this.createEditorState(this.props.problem.content)}
      initialExplanationEditorState={this.createEditorState(this.props.problem.explanation)}
    />
}

export { ProblemBeingSolved };
