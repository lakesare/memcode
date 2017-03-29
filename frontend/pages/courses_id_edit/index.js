import React from 'react';

import { Header }  from '~/components/Header';
import { Loading } from '~/components/Loading';
import { Actions } from '~/components/Actions';
import { OldProblem } from './components/OldProblem';
import { NewProblem } from './components/NewProblem';
import { Instructions } from './components/Instructions';

import * as ProblemApi from '~/api/Problem';

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
      speGetProblems: {}
    };
  }

  componentDidMount = () => {
    ProblemApi.getAllByCourseId(
      spe => this.setState({ speGetProblems: spe }),
      this.props.params.id
    );
  }

  addNewProblem = (createdProblem) => {
    const spe = Immutable.fromJS(this.state.speGetProblems);
    const newSpe = spe.updateIn(['payload'], problems => problems.push(createdProblem));

    this.setState({ speGetProblems: newSpe.toJS() });
  }

  updateOldProblem = (updatedProblem) => {
    const spe = Immutable.fromJS(this.state.speGetProblems);

    const index = spe.getIn(['payload']).findIndex(
      (problem) => problem.get('id') === updatedProblem.id
    );
    const newSpe = spe.setIn(['payload', index], updatedProblem);

    this.setState({ speGetProblems: newSpe.toJS() });
  }

  removeOldProblem = (problemId) => {
    const spe = Immutable.fromJS(this.state.speGetProblems);

    const index = spe.getIn(['payload']).findIndex(
      (problem) => problem.get('id') === problemId
    );

    const newSpe = spe.updateIn(['payload'], problems => problems.delete(index));

    this.setState({ speGetProblems: newSpe.toJS() });
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
        <Actions courseId={this.props.params.id}/>
      </div>

      <Loading spe={this.state.speGetProblems}>{problems =>
        <div className="container">
          <section className="problems">
            <div className="thead">
              <div className="content">Content</div>
              <div className="explanation">Explanation</div>
              <Instructions/>
            </div>
            <div className="tbody">
              {this.renderListOfProblems(problems)}
            </div>
            <NewProblem courseId={this.props.params.id} addNewProblem={this.addNewProblem}/>
          </section>
        </div>
      }</Loading>
    </main>
}

export { Page_courses_id_edit };
