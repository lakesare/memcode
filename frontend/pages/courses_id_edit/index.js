import { Header }  from '~/components/Header';
import { Loading } from '~/components/Loading';
import { CourseActions } from '~/components/CourseActions';
import { OldProblem } from './components/OldProblem';
import { NewProblem } from './components/NewProblem';
import { Cheatsheet } from './components/Cheatsheet';
import { Instructions } from './components/Instructions';
import { CourseDetails } from './components/CourseDetails';

import { commonFetch } from '~/api/commonFetch';

import Immutable from 'immutable';

import css from './index.css';

class Page_courses_id_edit extends React.Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string
    }).isRequired,
    changeAmountOfProblemsToLearnBy: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      speGetPage: {}
    };
  }

  componentDidMount = () =>
    commonFetch(
      spe => this.setState({ speGetPage: spe }),
      'GET', `/api/pages/courses/${this.props.params.id}/edit`
    );

  addNewProblem = (createdProblem) => {
    const spe = Immutable.fromJS(this.state.speGetPage);
    const newSpe = spe.updateIn(['payload', 'problems'], problems => problems.push(createdProblem));
    this.setState({ speGetPage: newSpe.toJS() });

    this.props.changeAmountOfProblemsToLearnBy(1);
  }

  updateOldProblem = (updatedProblem) => {
    const spe = Immutable.fromJS(this.state.speGetPage);

    const index = spe.getIn(['payload', 'problems']).findIndex(
      (problem) => problem.get('id') === updatedProblem.id
    );
    const newSpe = spe.setIn(['payload', 'problems', index], updatedProblem);

    this.setState({ speGetPage: newSpe.toJS() });
  }

  removeOldProblem = (problemId) => {
    const spe = Immutable.fromJS(this.state.speGetPage);

    const index = spe.getIn(['payload', 'problems']).findIndex(
      (problem) => problem.get('id') === problemId
    );

    const newSpe = spe.updateIn(['payload', 'problems'], problems => problems.delete(index));

    this.setState({ speGetPage: newSpe.toJS() });
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
        <Loading spe={this.state.speGetPage}>{({ problems, course }) =>
          <section className="problems">
            <div className="thead">
              <CourseDetails course={course}/>
              <Cheatsheet/>
            </div>
            <div className="tbody">
              {this.renderListOfProblems(problems)}
              <NewProblem courseId={this.props.params.id} addNewProblem={this.addNewProblem}/>
            </div>

            <Instructions/>
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
