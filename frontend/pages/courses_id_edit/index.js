import React from 'react';

import { Header }  from '~/components/Header';
import { Loading } from '~/components/Loading';
import { CourseActions } from '~/components/CourseActions';
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
    }).isRequired,
    changeAmountOfProblemsToLearnBy: React.PropTypes.func.isRequired
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

    this.props.changeAmountOfProblemsToLearnBy(1);
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
        <CourseActions courseId={this.props.params.id}/>
        <Loading spe={this.state.speGetProblems}>{problems =>
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
        }</Loading>
      </div>
    </main>
}

import { connect } from 'react-redux';
Page_courses_id_edit = connect(
  () => ({}),
  (dispatch) => ({
    changeAmountOfProblemsToLearnBy: (by) => dispatch({
      type: 'CHANGE_AMOUNT_OF_PROBLEMS_TO_LEARN_BY',
      payload: by
    })
  })
)(Page_courses_id_edit);

export { Page_courses_id_edit };
