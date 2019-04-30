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
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string
      })
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
        content: "Enter the question, you will be asked this question when you're learning the flashcards (e.g. 'What's one and only Earth's satellite?')",
        placement: 'bottom'
      },
      {
        target: '.new-problem .second-column',
        content: "Enter the answer (e.g. 'Moon')",
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
    this.apiGetPage();
    // .then(() => {
    //   setTimeout(() => {
    //     this.setState({ joyrideHowToCreateProblemRun: true });
    //   }, 3000);
    // });
  }

  apiGetPage = () =>
    commonFetch(
      (spe) => this.setState({ speGetPage: spe }),
      'GET', `/api/pages/courses/${this.props.match.params.id}/edit`
    )

  uiAddOptimisticProblem = (optimisticProblem) => {
    this.setState({
      speGetPage:
      update(this.state.speGetPage, `payload.problems`,
        (problems) => [...problems, optimisticProblem]
      )
    });
  }

  uiUpdateOptimisticProblemIntoOld = (optimisticId, createdProblem) => {
    const index = this.state.speGetPage.payload.problems.findIndex(
      (problem) => problem._optimistic_id === optimisticId
    );

    this.setState({
      speGetPage:
      update(this.state.speGetPage, `payload.problems[${index}]`, () => createdProblem)
    });

    this.props.IdsOfProblemsToLearnAndReviewPerCourseActions.createProblem(this.props.match.params.id, createdProblem.id);

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

  ifShowActionsForSelectedProblems = () =>
    this.state.idsOfCheckedProblems.length > 0

  renderActionsForCheckedProblems = () => (
    this.ifShowActionsForSelectedProblems() ?
      <Sticky>{({ isSticky }) =>
        <ActionsForCheckedProblems
          idsOfCheckedProblems={this.state.idsOfCheckedProblems}
          updateIdsOfCheckedProblems={(idsOfCheckedProblems) => this.setState({ idsOfCheckedProblems })}
          uiRemoveOldProblems={this.uiRemoveOldProblems}
          isSticky={isSticky}
        />
      }</Sticky> :
      null
  )

  renderProblems = () =>
    <Loading spe={this.state.speGetPage}>{({ problems }) =>
      <section className="problems">
        {problems.map((problem, index) =>
          <OldProblem
            key={problem._optimistic_id ? problem._optimistic_id : problem.id}
            problem={problem}
            index={index}
            updateOldProblem={this.updateOldProblem}
            removeOldProblem={this.removeOldProblem}
            problems={problems}
            idsOfCheckedProblems={this.state.idsOfCheckedProblems}
            updateIdsOfCheckedProblems={(ids) => this.setState({ idsOfCheckedProblems: ids })}
          />
        )}
      </section>
    }</Loading>

  render = () =>
    <main className={`${css.main} ${this.ifShowActionsForSelectedProblems() ? '-if-showing-actions-for-selected-problems' : ''}`}>
      <Joyride
        steps={this.state.joyrideHowToCreateProblemSteps}
        run={this.state.joyrideHowToCreateProblemRun}
        showSkipButton
        showProgress
        continuous
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
      <Joyride
        steps={this.state.joyrideHowToReviewProblemSteps}
        run={this.state.joyrideHowToReviewProblemRun}
        showSkipButton
        showProgress
        continuous
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
      <Header dontLinkToLearnOrReview={this.props.match.params.id}/>

      <CourseActions courseId={this.props.match.params.id} ifEditCourseModalTogglerIsDisplayed ifCourseDescriptionIsDisplayed ifBreadcrumbsAreDisplayed ifConfused/>
      <StickyContainer>
        {this.renderActionsForCheckedProblems()}
        <div className="container">
          {this.renderProblems()}
          <NewProblem
            courseId={this.props.match.params.id}
            uiAddOptimisticProblem={this.uiAddOptimisticProblem}
            uiUpdateOptimisticProblemIntoOld={this.uiUpdateOptimisticProblemIntoOld}
          />
          <Instructions/>
        </div>
      </StickyContainer>

      <Footer/>
    </main>
}

export default Page_courses_id_edit;
