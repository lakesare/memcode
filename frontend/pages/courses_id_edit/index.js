import { update } from 'lodash';

import { StickyContainer, Sticky } from 'react-sticky';
import { Header }  from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';
import { CourseActions } from '~/components/CourseActions';
import { OldProblem } from './components/OldProblem';
import { NewProblem } from './components/NewProblem';
// import { Cheatsheet } from './components/Cheatsheet';
import { Instructions } from './components/Instructions';
// import { CourseDetails } from './components/CourseDetails';
import { ActionsForCheckedProblems } from './components/ActionsForCheckedProblems';

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
    speGetPage: {},
    idsOfCheckedProblems: []
  }

  componentDidMount = () =>
    this.apiGetPage()

  apiGetPage = () =>
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
      ),
      idsOfCheckedProblems: this.state.idsOfCheckedProblems.filter((id) => id !== problemId)
    });
    this.props.IdsOfProblemsToLearnAndReviewPerCourseActions.deleteProblem(problemId);
  }

  // TODO is performance ok, are we not dying?
  uiRemoveOldProblems = (problemIds) =>
    problemIds.forEach(this.removeOldProblem)

  renderActionsForCheckedProblems = () => (
    <div style={{ marginBottom: 20, marginTop: 20 }}>
      {
        this.state.idsOfCheckedProblems.length > 0 ?
          <Sticky>{({ isSticky }) =>
            <ActionsForCheckedProblems
              idsOfCheckedProblems={this.state.idsOfCheckedProblems}
              uiRemoveOldProblems={this.uiRemoveOldProblems}
              isSticky={isSticky}
            />
          }</Sticky> :
          null
      }
    </div>
  )

  renderProblems = (problems) =>
    <section className="problems">
      {problems.map((problem, index) =>
        <OldProblem
          key={problem.id}
          problem={problem}
          index={index}
          updateOldProblem={this.updateOldProblem}
          removeOldProblem={this.removeOldProblem}
          idsOfCheckedProblems={this.state.idsOfCheckedProblems}
          updateIdsOfCheckedProblems={(ids) => this.setState({ idsOfCheckedProblems: ids })}
        />
      )}
      <NewProblem courseId={this.props.params.id} addNewProblem={this.addNewProblem}/>
    </section>

  render = () =>
    <main className={css.main}>
      <Header/>

      <div className="container">
        <CourseActions courseId={this.props.params.id}/>

        <Loading spe={this.state.speGetPage}>{({ problems }) =>
          <StickyContainer>
            {this.renderActionsForCheckedProblems()}
            {this.renderProblems(problems)}
            <Instructions/>
          </StickyContainer>
        }</Loading>
      </div>

      <Footer/>
    </main>
}

export { Page_courses_id_edit };
