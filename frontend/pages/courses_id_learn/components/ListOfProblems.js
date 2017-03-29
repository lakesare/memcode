import React from 'react';

import { Problem } from '~/components/Problem';

import * as CourseUserIsLearningApi from '~/api/CourseUserIsLearning';

class ListOfProblems extends React.Component {
  static propTypes = {
    problems: React.PropTypes.array.isRequired,
    courseUserIsLearningId: React.PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      idsOfLearnedProblems: []
    };
  }

  apiLearn = (problemId) => {
    CourseUserIsLearningApi.learnProblem(
      () => {},
      this.props.courseUserIsLearningId, problemId
    );
    this.markProblemAsLearned(problemId);
  }

  markProblemAsLearned = (problemId) =>
    this.setState({
      idsOfLearnedProblems: [...this.state.idsOfLearnedProblems, problemId]
    })

  ifProblemIsLearned = (problemId) =>
    this.state.idsOfLearnedProblems.includes(problemId)

  renderProblem = (problem) =>
    <Problem
      mode="viewing"
      initialContentEditorState={problem.content}
      initialExplanationEditorState={problem.explanation}
    />

  renderProblemWrapper = (problem) => {
    if (this.ifProblemIsLearned(problem.id)) {
      return <div key={problem.id} className="problem-wrapper -learned">
        {this.renderProblem(problem)}
      </div>;
    } else {
      return <div key={problem.id} className="problem-wrapper" onClick={() => this.apiLearn(problem.id)}>
        {this.renderProblem(problem)}
      </div>;
    }
  }

  render = () =>
    <section className="problems">
      {this.props.problems.map(this.renderProblemWrapper)}
    </section>
}

export { ListOfProblems };
