import React from 'react';

import { Header }  from '~/components/Header';
import { Loading } from '~/components/Loading';
import { OldProblem } from './components/OldProblem';
import { NewProblem } from './components/NewProblem';

import * as CourseApi from '~/api/Course';

import Immutable from 'immutable';

import css from './index.css';

class Page_courses_id_edit extends React.Component {
  static propTypes = {
    params: React.PropTypes.shape({
      id: React.PropTypes.string
    }).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      speGetCourse: {}
    };
  }

  componentDidMount = () => {
    CourseApi.show(
      spe => this.setState({ speGetCourse: spe }),
      this.props.params.id
    );
  }

  addNewProblem = (createdProblem) => {
    const spe = Immutable.fromJS(this.state.speGetCourse);
    const newSpe = spe.updateIn(['payload', 'problems'], problems => problems.push(createdProblem));

    this.setState({ speGetCourse: newSpe.toJS() });
  }

  updateOldProblem = (updatedProblem) => {
    const spe = Immutable.fromJS(this.state.speGetCourse);

    const index = spe.getIn(['payload', 'problems']).findIndex(
      (problem) => problem.get('id') === updatedProblem.id
    );
    const newSpe = spe.setIn(['payload', 'problems', index], updatedProblem);

    this.setState({ speGetCourse: newSpe.toJS() });
  }

  removeOldProblem = (problemId) => {
    const spe = Immutable.fromJS(this.state.speGetCourse);

    const index = spe.getIn(['payload', 'problems']).findIndex(
      (problem) => problem.get('id') === problemId
    );
    const newSpe = spe.updateIn(['payload', 'problems'], problems => problems.pop(index));

    this.setState({ speGetCourse: newSpe.toJS() });
  }

  renderListOfProblems = problems =>
    problems.map((problem) =>
      <OldProblem
        key={problem.id}
        problem={problem}
        updateOldProblem={this.updateOldProblem}
        removeOldProblem={this.removeOldProblem}
      />
    )

  render = () =>
    <main className={css.main}>
      <Header/>

      <div className="container">
        <Loading spe={this.state.speGetCourse}>{payload =>
          <div>
            <h1>{payload.course.title}</h1>

            {this.renderListOfProblems(payload.problems)}

            <NewProblem courseId={this.props.params.id} addNewProblem={this.addNewProblem}/>
          </div>
        }</Loading>
      </div>
    </main>
}

export { Page_courses_id_edit };
