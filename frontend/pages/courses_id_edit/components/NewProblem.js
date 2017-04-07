import React from 'react';

import { Problem } from '~/components/Problem';

import * as ProblemApi from '~/api/Problem';

class NewProblem extends React.Component {
  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    addNewProblem: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      speCreateProblem: {},
      key: this.randomKey()
    };
  }

  save = (content) =>
    ProblemApi.create(
      (spe) => this.setState({ speCreateProblem: spe }),
      { content, type: 'inlinedAnswers', courseId: this.props.courseId }
    )
      .then((createdProblem) => {
        this.props.addNewProblem(createdProblem);
        this.setState({ key: this.randomKey() });
      });

  // :-D. yeaah. because Draft will keep the state otherwise, but we want our inputs cleared when we add a new problem.
  // alternative would be to keep state in this component, but I'm expicitly avoiding this.
  randomKey = () => Math.random(1) * 10000

  render = () =>
    <Problem key={this.state.key} mode="editing" saveFn={this.save}/>
}

export { NewProblem };
