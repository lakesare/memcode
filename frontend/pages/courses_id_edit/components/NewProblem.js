import React from 'react';

import { EditorState } from 'draft-js';

import { Problem } from '~/components/Problem';

import * as ProblemApi from '~/api/Problem';

class NewProblem extends React.Component {
  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    addNewProblem: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { speCreateProblem: {} };
  }

  save = (content, explanation) =>
    ProblemApi.create(
      (spe) => this.setState({ speCreateProblem: spe }),
      { content, explanation, courseId: this.props.courseId }
    )
      .then((createdProblem) => {
        this.props.addNewProblem(createdProblem);
        return Promise.resolve({
          contentEditorState: EditorState.createEmpty(),
          explanationEditorState: EditorState.createEmpty()
        });
      });

  render = () =>
    <Problem mode="editing" saveFn={this.save}/>
}

export { NewProblem };
