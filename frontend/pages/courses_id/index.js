import orFalse from '~/services/orFalse';
import { update } from 'lodash';
import injectFromOldToNewIndex from '~/services/injectFromOldToNewIndex';

import api from '~/api';
import { commonFetch } from '~/api/commonFetch';
import Roles from '~/services/Roles';

import { StickyContainer, Sticky } from 'react-sticky';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Main from '~/appComponents/Main';
import Loading from '~/components/Loading';
import Problem from '~/components/Problem';
import CourseActions from '~/components/CourseActions';
import OldProblem from './components/OldProblem';
import NewProblem from './components/NewProblem';
// import { Cheatsheet } from './components/Cheatsheet';
// import { Instructions } from './components/Instructions';
import ActionsForCheckedProblems from './components/ActionsForCheckedProblems';

import css from './index.css';

import { getAllActions } from '~/reducers/IdsOfProblemsToLearnAndReviewPerCourse';
import MyDuck from '~/ducks/MyDuck';

@connect(
  (state) => ({
    currentUser: state.global.Authentication.currentUser || false,
    speCourseForActions: state.global.My.speCourseForActions,
    idsOfProblemsToLearnAndReviewPerCourse: state.global.IdsOfProblemsToLearnAndReviewPerCourse
  }),
  (dispatch, ownProps) => ({
    setSpeCourseForActions: (spe) => dispatch({ type: 'SET_SPE_GET_COURSE', payload: spe }),
    apiGetCourseForActions: () => dispatch(MyDuck.actions.apiGetCourseForActions(ownProps.match.params.id)),
    IdsOfProblemsToLearnAndReviewPerCourseActions: getAllActions(dispatch),
    MyActions: dispatch(MyDuck.getActions)
  })
)
class Page_courses_id extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    idsOfProblemsToLearnAndReviewPerCourse: orFalse(PropTypes.object).isRequired,
    IdsOfProblemsToLearnAndReviewPerCourseActions: PropTypes.object.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired,
    apiGetCourseForActions: PropTypes.func.isRequired,
    speCourseForActions: PropTypes.object.isRequired,
    setSpeCourseForActions: PropTypes.func.isRequired,
    MyActions: PropTypes.object.isRequired
  }

  state = {
    speGetProblems: {},
    idsOfCheckedProblems: []
  }

  componentDidMount = () => {
    this.apiGetPage();
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.apiGetPage();
    }
  }

  getCourseId = () => {
    return Number.parseInt(this.props.match.params.id);
  }

  apiGetPage = () => {
    commonFetch(
      (spe) => this.setState({ speGetProblems: spe }),
      'GET', `/api/pages/courses/${this.props.match.params.id}`
    );
    this.props.apiGetCourseForActions();
  }

  uiAddOptimisticProblem = (optimisticProblem) => {
    this.setState({
      speGetProblems:
      update(this.state.speGetProblems, `payload.problems`,
        (problems) => [...problems, optimisticProblem]
      )
    });
  }

  uiUpdateOptimisticProblemIntoOld = (optimisticId, createdProblem) => {
    const index = this.state.speGetProblems.payload.problems.findIndex(
      (problem) => problem._optimistic_id === optimisticId
    );

    this.setState({
      speGetProblems:
      update(this.state.speGetProblems, `payload.problems[${index}]`, () => createdProblem)
    });

    this.props.MyActions.createProblem(this.getCourseId(), createdProblem.id);
  }

  updateOldProblem = (updatedProblem) => {
    const index = this.state.speGetProblems.payload.problems.findIndex(
      (problem) => problem.id === updatedProblem.id
    );

    this.setState({
      speGetProblems:
      update(this.state.speGetProblems, `payload.problems[${index}]`, () => updatedProblem)
    });
  }

  removeOldProblem = (problemId) => {
    this.setState({
      speGetProblems:
      update(this.state.speGetProblems, `payload.problems`,
        (problems) => problems.filter((problem) => problem.id !== problemId)
      ),
      idsOfCheckedProblems: this.state.idsOfCheckedProblems.filter((id) => id !== problemId)
    });
    this.props.MyActions.deleteProblem(this.getCourseId(), problemId);
  }

  // TODO is performance ok, are we not dying?
  uiRemoveOldProblems = (problemIds) => {
    this.setState({
      speGetProblems:
      update(this.state.speGetProblems, `payload.problems`,
        (problems) => problems.filter((problem) => !problemIds.includes(problem.id))
      ),
      idsOfCheckedProblems: []
    });

    problemIds.forEach((problemId) => {
      this.props.MyActions.deleteProblem(this.getCourseId(), problemId);
    });
  }

  renderActionsForCheckedProblems = () =>
    <Sticky>{({ isSticky }) =>
      <ActionsForCheckedProblems
        idsOfCheckedProblems={this.state.idsOfCheckedProblems}
        updateIdsOfCheckedProblems={(idsOfCheckedProblems) => this.setState({ idsOfCheckedProblems })}
        uiRemoveOldProblems={this.uiRemoveOldProblems}
        isSticky={isSticky}
      />
    }</Sticky>

  apiReorderProblems = () =>
    api.ProblemApi.reorder(
      false,
      this.state.speGetProblems.payload.problems.map((problem, index) => ({
        id: problem.id,
        // position cannot be 0 (so we can never make any flashcard 0s), because then it will just move to the end of the queue
        position: index + 1
      }))
    )

  onDragEnd = (result) => {
    // if dropped outside the list
    if (!result.destination) {
      return;
    }

    const from = result.source.index;
    const to = result.destination.index;

    this.setState({
      speGetProblems:
      update(this.state.speGetProblems, `payload.problems`,
        (problems) => injectFromOldToNewIndex(problems, from, to)
      )
    }, this.apiReorderProblems);
  }

  renderEditProblems = () =>
    <div className={css.edit}>
      <StickyContainer>
        {this.renderActionsForCheckedProblems()}
        <div className="container problems-container">
          <Loading spe={this.state.speGetProblems}>{({ problems }) =>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="problems">{(provided) =>
                <section
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="problems"
                >
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
                  {provided.placeholder}
                </section>
              }</Droppable>
            </DragDropContext>
          }</Loading>
          <NewProblem
            courseId={this.props.match.params.id}
            uiAddOptimisticProblem={this.uiAddOptimisticProblem}
            uiUpdateOptimisticProblemIntoOld={this.uiUpdateOptimisticProblemIntoOld}
          />
        </div>
      </StickyContainer>
    </div>

  renderShowProblems = () =>
    <div className={`container ${css.view}`}>
      <Loading spe={this.state.speGetProblems}>{({ problems }) =>
        <section className="problems">
          {problems.map((problem, index) =>
            <div key={problem.id} className="problem-wrapper">
              <div className="index">{index + 1}</div>
              <Problem
                mode="show"
                problemContent={problem.content}
                problemType={problem.type}
              />
            </div>
          )}
        </section>
      }</Loading>
    </div>

  render = () =>
    <Main dontLinkToLearnOrReview={this.props.match.params.id}>
      <CourseActions
        courseId={this.props.match.params.id}
        currentUser={this.props.currentUser}

        speCourseForActions={this.props.speCourseForActions}
        setSpeCourseForActions={this.props.setSpeCourseForActions}

        idsOfProblemsToLearnAndReviewPerCourse={this.props.idsOfProblemsToLearnAndReviewPerCourse}
        IdsOfProblemsToLearnAndReviewPerCourseActions={this.props.IdsOfProblemsToLearnAndReviewPerCourseActions}

        type="editOrShow"
      />

      <Loading spe={this.props.speCourseForActions}>{({ course, coauthors }) =>
        Roles.canIEditCourse({ currentUser: this.props.currentUser, course, coauthors }) ?
          this.renderEditProblems() :
          this.renderShowProblems()
      }</Loading>
    </Main>
}

export default Page_courses_id;
