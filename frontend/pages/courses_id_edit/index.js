import { update } from 'lodash';

import { Header }  from '~/components/Header';
import { Loading } from '~/components/Loading';
import { CourseActions } from '~/components/CourseActions';
import { OldProblem } from './components/OldProblem';
import { NewProblem } from './components/NewProblem';
import { Cheatsheet } from './components/Cheatsheet';
import { Instructions } from './components/Instructions';
import { CourseDetails } from './components/CourseDetails';

import { commonFetch } from '~/api/commonFetch';

import css from './index.css';


class Page_courses_id_edit extends React.Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string
    }).isRequired,
    changeAmountOfProblemsToLearnBy: PropTypes.func.isRequired
  }

  state = {
    speGetPage: {}
  }

  componentDidMount = () =>
    commonFetch(
      (spe) => this.setState({ speGetPage: spe }),
      'GET', `/api/pages/courses/${this.props.params.id}/edit`
    )

  addNewProblem = (createdProblem) => {
    this.setState({
      speGetPage:
      update(this.state.speGetPage, `payload.problems`,
        (problems) => [...problems, createdProblem]
      )
    });
    this.props.changeAmountOfProblemsToLearnBy(1);
  }

  updateOldProblem = (updatedProblem) => {
    const index = this.state.speGetPage.payload.problems.findIndex(
      (problem) => problem.id === updatedProblem.id
    );

    this.setState({
      speGetPage:
      update(this.state.speGetPage, `payload.problems[${index}]`, () => updatedProblem)
    });
  }

  removeOldProblem = (problemId) =>
    this.setState({
      speGetPage:
      update(this.state.speGetPage, `payload.problems`,
        (problems) => problems.filter((problem) => problem.id !== problemId)
      )
    })

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
              {problems.map((problem) =>
                <OldProblem
                  key={problem.id}
                  problem={problem}
                  updateOldProblem={this.updateOldProblem}
                  removeOldProblem={this.removeOldProblem}
                />
              )}
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
