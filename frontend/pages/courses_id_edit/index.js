import { update } from 'lodash';

import { Header }  from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';
import { CourseActions } from '~/components/CourseActions';
import { OldProblem } from './components/OldProblem';
import { NewProblem } from './components/NewProblem';
import { Cheatsheet } from './components/Cheatsheet';
import { Instructions } from './components/Instructions';
import { CourseDetails } from './components/CourseDetails';

import { commonFetch } from '~/api/commonFetch';

import css from './index.css';

import { IdsOfProblemsToLearnAndReviewPerCourseActions } from '~/reducers/IdsOfProblemsToLearnAndReviewPerCourse';
@connect(
  () => ({}),
  (dispatch) => ({
    IdsOfProblemsToLearnAndReviewPerCourseActions: {
      createProblem: (courseId, problemId) => IdsOfProblemsToLearnAndReviewPerCourseActions.createProblem(dispatch, courseId, problemId),
      deleteProblem: (problemId) =>
        IdsOfProblemsToLearnAndReviewPerCourseActions.deleteProblem(dispatch, problemId)
    }
  })
)
class Page_courses_id_edit extends React.Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string
    }).isRequired,
    IdsOfProblemsToLearnAndReviewPerCourseActions: PropTypes.shape({
      createProblem: PropTypes.func.isRequired,
      deleteProblem: PropTypes.func.isRequired
    }).isRequired
  }

  state = {
    speGetPage: {}
  }

  componentDidMount = () =>
    this.apiGetPage()

  componentDidUpdate = (prevProps) => {
    if (prevProps.params.id !== this.props.params.id) {
      this.apiGetPage();
    }
  }

  apiGetPage = () =>
    commonFetch(
      (spe) => this.setState({ speGetPage: spe }),
      'GET', `/api/pages/courses/${this.props.params.id}/edit`
    )

  uiUpdateCourse = (updatedCourse) => {
    this.setState({
      speGetPage:
      update(this.state.speGetPage, `payload.course`, () => updatedCourse)
    });
  }

  addNewProblem = (createdProblem) => {
    this.setState({
      speGetPage:
      update(this.state.speGetPage, `payload.problems`,
        (problems) => [...problems, createdProblem]
      )
    });
    this.props.IdsOfProblemsToLearnAndReviewPerCourseActions.createProblem(this.props.params.id, createdProblem.id);
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

  removeOldProblem = (problemId) => {
    this.setState({
      speGetPage:
      update(this.state.speGetPage, `payload.problems`,
        (problems) => problems.filter((problem) => problem.id !== problemId)
      )
    });
    this.props.IdsOfProblemsToLearnAndReviewPerCourseActions.deleteProblem(problemId);
  }

  render = () =>
    <main className={css.main} key={this.props.params.id}>
      <Header/>

      <div className="container">
        <CourseActions courseId={this.props.params.id}/>
        <Loading spe={this.state.speGetPage}>{({ problems, course }) =>
          <section className="problems">
            <div className="thead">
              <CourseDetails course={course} uiUpdateCourse={this.uiUpdateCourse}/>
              {false && <Cheatsheet/>}
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

      <Footer/>
    </main>
}

export { Page_courses_id_edit };
