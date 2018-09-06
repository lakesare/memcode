import { update } from 'lodash';

import Joyride from 'react-joyride';
import { StickyContainer, Sticky } from 'react-sticky';
import { Header }  from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';
import { CourseActions } from '~/components/CourseActions';
import { OldProblem } from './components/OldProblem';
import { NewProblem } from './components/NewProblem';
// import { Cheatsheet } from './components/Cheatsheet';
import { Instructions } from './components/Instructions';
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
    idsOfCheckedProblems: [],
    joyrideHowToCreateProblemRun: false,
    joyrideHowToCreateProblemSteps: [
      {
        target: 'section.choose-type',
        content: 'You can create 2 types of flashcards',
        placement: 'bottom'
      },
      {
        target: '.new-problem .first-column',
        content: "Enter the question, you will be asked this question when you're learning the flashcards (What's 2x2?)",
        placement: 'bottom'
      },
      {
        target: '.new-problem .second-column',
        content: "Enter the answer (4)",
        placement: 'bottom'
      },
      {
        target: '.new-problem .how-to-create button',
        content: "Save the new flashcard!",
        placement: 'bottom'
      }
    ],
    joyrideHowToReviewProblemRun: false,
    joyrideHowToReviewProblemSteps: [
      {
        target: 'section.problems section.checkbox .index-and-mark',
        content: "Yay, flashcard got saved! Now you can delete it by clicking on its number.",
        placement: 'bottom'
      },
      {
        target: 'section.problems .problem .first-column',
        content: "To edit it - just type something, and click somewhere else - it will save automatically!",
        placement: 'bottom'
      },
      {
        target: 'section.title-and-buttons a.learn',
        content: "Learn the created flashcard!",
        placement: 'bottom'
      },
      {
        target: 'section.title-and-buttons a.review',
        content: 'After you learn the flashcards - we will offer you to Review them from time to time!',
        placement: 'bottom'
      }
    ]
  }

  componentDidMount = () => {
    this.apiGetPage()
      .then(() => {
        setTimeout(() => {
          this.setState({ joyrideHowToCreateProblemRun: true });
        }, 3000);
      });
  }

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

    setTimeout(() => {
      this.setState({ joyrideHowToReviewProblemRun: true });
    }, 3000);
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

  renderProblems = () =>
    <Loading spe={this.state.speGetPage}>{({ problems }) =>
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
      </section>
    }</Loading>

  render = () =>
    <main className={css.main}>
      <Joyride
        steps={this.state.joyrideHowToCreateProblemSteps}
        run={this.state.joyrideHowToCreateProblemRun}
        // callback={this.callback}
        hideBackButton
        // disableOverlay
        styles={{
          options: {
            arrowColor: '#ffffff',
            backgroundColor: '#ffffff',
            primaryColor: '#ec60ac',
            textColor: '#004a14',
            width: 200,
          }
        }}
      />
      <Joyride
        steps={this.state.joyrideHowToReviewProblemSteps}
        run={this.state.joyrideHowToReviewProblemRun}
        hideBackButton
        styles={{
          options: {
            arrowColor: '#ffffff',
            backgroundColor: '#ffffff',
            primaryColor: '#ec60ac',
            textColor: '#004a14',
            width: 200,
          }
        }}
      />
      <Header dontLinkToLearnOrReview={this.props.params.id}/>

      <CourseActions courseId={this.props.params.id} ifEditCourseModalTogglerIsDisplayed ifCourseDescriptionIsDisplayed ifBreadcrumbsAreDisplayed ifConfused/>
      <StickyContainer>
        <div className="container">
          {this.renderActionsForCheckedProblems()}
          {this.renderProblems()}
          <NewProblem courseId={this.props.params.id} addNewProblem={this.addNewProblem}/>
          <Instructions/>
        </div>
      </StickyContainer>

      <Footer/>
    </main>
}

export { Page_courses_id_edit };
