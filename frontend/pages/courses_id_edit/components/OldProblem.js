import React from 'react';

import { EditorState, convertFromRaw } from 'draft-js';

import * as ProblemApi from '~/api/Problem';

import { Problem } from '~/components/Problem';

class OldProblem extends React.Component {
  static propTypes = {
    problem: React.PropTypes.object.isRequired,
    updateOldProblem: React.PropTypes.func.isRequired,
    removeOldProblem: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      speUpdateProblem: {},
      speDestroyProblem: {}
    };
  }

  createEditorState = (raw) =>
    EditorState.createWithContent(convertFromRaw(raw));

  save = (content, explanation) =>
    ProblemApi.update(
      (spe) => this.setState({ speUpdateProblem: spe }),
      this.props.problem.id,
      { content, explanation }
    )
      .then((updatedProblem) => {
        this.props.updateOldProblem(updatedProblem);
        return Promise.resolve();
      });

  destroy = () => {
    ProblemApi.destroy(
      (spe) => this.setState({ speDestroyProblem: spe }),
      this.props.problem.id
    )
      .then(() => {
        this.props.removeOldProblem(this.props.problem.id);
      });
  }

  render = () =>
    <Problem
      mode={'editing'}
      saveFn={this.save}
      destroyFn={this.destroy}
      initialContentEditorState={this.createEditorState(this.props.problem.content)}
      initialExplanationEditorState={this.createEditorState(this.props.problem.explanation)}
    />
}

export { OldProblem };
