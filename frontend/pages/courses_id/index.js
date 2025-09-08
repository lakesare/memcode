import orFalse from '~/services/orFalse';
import _update from 'lodash/update';
import injectFromOldToNewIndex from '~/services/injectFromOldToNewIndex';

import api from '~/api';
import Roles from '~/services/Roles';

import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Main from '~/appComponents/Main';
import Loading from '~/components/Loading';
import Problem from '~/components/Problem';
import CourseActions from '~/components/CourseActions';
import OldProblem from './components/OldProblem';
import NewProblem from './components/NewProblem';
// import { Cheatsheet } from './components/Cheatsheet';
// import { Instructions } from './components/Instructions';

import css from './index.scss';

import MyDuck from '~/ducks/MyDuck';

@connect(
  (state, ownProps) => ({
    courseId: Number.parseInt(ownProps.match.params.id),
    currentUser: state.global.Authentication.currentUser || false,
    My: state.global.My
  }),
  (dispatch) => ({
    MyActions: dispatch(MyDuck.getActions)
  })
)
class Page_courses_id extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired,
    MyActions: PropTypes.object.isRequired,
    My: PropTypes.object.isRequired
  }

  state = {
    speGetProblems: {},
    idsOfCheckedProblems: [],
    lastClickedIndex: null,
    lastClickAction: null, // 'select' or 'unselect' - tracks what the last normal click did
    isShiftPressed: false,
    hoveredIndex: null
  }

  componentDidMount = () => {
    this.apiGetPage();
    
    // Add global keyboard event listeners for shift key tracking
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount = () => {
    // Clean up global keyboard event listeners
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.courseId !== this.props.courseId) {
      this.apiGetPage();
    }
  }

  handleKeyDown = (event) => {
    if (event.key === 'Shift' && !this.state.isShiftPressed) {
      this.setState({ isShiftPressed: true });
    }
  }

  handleKeyUp = (event) => {
    if (event.key === 'Shift' && this.state.isShiftPressed) {
      this.setState({ isShiftPressed: false, hoveredIndex: null });
    }
  }

  setHoveredIndex = (index) => {
    this.setState({ hoveredIndex: index });
  }

  apiGetPage = () => {
    api.get.PageApi.getCoursePage(
      (spe) => this.setState({ speGetProblems: spe }),
      { courseId: this.props.courseId }
    );
    this.props.MyActions.apiGetCourseForActions(this.props.courseId);
  }

  uiAddOptimisticProblem = (optimisticProblem) => {
    this.setState({
      speGetProblems:
      _update(this.state.speGetProblems, `payload.problems`,
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
      _update(this.state.speGetProblems, `payload.problems[${index}]`, () => createdProblem)
    });

    this.props.MyActions.createProblem(this.props.courseId, createdProblem.id);
  }

  updateOldProblem = (updatedProblem) => {
    const index = this.state.speGetProblems.payload.problems.findIndex(
      (problem) => problem.id === updatedProblem.id
    );

    this.setState({
      speGetProblems:
      _update(this.state.speGetProblems, `payload.problems[${index}]`, () => updatedProblem)
    });
  }

  removeOldProblem = (problemId) => {
    this.setState({
      speGetProblems:
      _update(this.state.speGetProblems, `payload.problems`,
        (problems) => problems.filter((problem) => problem.id !== problemId)
      ),
      idsOfCheckedProblems: this.state.idsOfCheckedProblems.filter((id) => id !== problemId)
    });
    this.props.MyActions.deleteProblem(this.props.courseId, problemId);
  }

  // TODO is performance ok, are we not dying?
  uiRemoveOldProblems = (problemIds) => {
    this.setState({
      speGetProblems:
      _update(this.state.speGetProblems, `payload.problems`,
        (problems) => problems.filter((problem) => !problemIds.includes(problem.id))
      ),
      idsOfCheckedProblems: []
    });

    problemIds.forEach((problemId) => {
      this.props.MyActions.deleteProblem(this.props.courseId, problemId);
    });
  }

  apiReorderProblems = () =>
    api.ProblemApi.reorder(
      false,
      this.state.speGetProblems.payload.problems.map((problem, index) => ({
        id: problem.id,
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
      _update(this.state.speGetProblems, `payload.problems`,
        (problems) => injectFromOldToNewIndex(problems, from, to, { direction: this.props.My.flashcardOrder })
      )
    }, this.apiReorderProblems);
  }

  setLastClickedIndex = (index) => {
    this.setState({ lastClickedIndex: index });
  }

  setLastClickAction = (action) => {
    this.setState({ lastClickAction: action });
  }

  renderOldProblemsToEdit = () => {
    const createdCoursesForSelect = this.props.My.courses
      .filter((courseDto) => {
        const ifAuthor = courseDto.course.user_id === this.props.currentUser.id;
        const ifCurrentCourse = courseDto.course.id === this.props.courseId;
        return ifAuthor && !ifCurrentCourse;
      })
      .map((courseDto) => ({ value: courseDto.course.id, label: courseDto.course.title }));

    return <Loading spe={this.state.speGetProblems} enabledStatuses={['success', 'failure']}>{({ problems }) => {
      const displayOrderedProblems = !this.props.My.flashcardOrder ? problems : problems.slice(0).reverse();
      
      return <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="problems">{(provided) =>
          <section
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="problems"
          >
            {displayOrderedProblems.map((problem, index) =>
              <OldProblem
                key={problem._optimistic_id ? problem._optimistic_id : problem.id}
                problem={problem}
                index={index}
                updateOldProblem={this.updateOldProblem}
                problems={displayOrderedProblems}
                idsOfCheckedProblems={this.state.idsOfCheckedProblems}
                updateIdsOfCheckedProblems={(ids) => this.setState({ idsOfCheckedProblems: ids })}
                uiRemoveOldProblems={this.uiRemoveOldProblems}
                createdCoursesForSelect={createdCoursesForSelect}
                flashcardOrder={this.props.My.flashcardOrder}
                lastClickedIndex={this.state.lastClickedIndex}
                setLastClickedIndex={this.setLastClickedIndex}
                lastClickAction={this.state.lastClickAction}
                setLastClickAction={this.setLastClickAction}
                uiAddOptimisticProblem={this.uiAddOptimisticProblem}
                uiUpdateOptimisticProblemIntoOld={this.uiUpdateOptimisticProblemIntoOld}
                isShiftPressed={this.state.isShiftPressed}
                hoveredIndex={this.state.hoveredIndex}
                setHoveredIndex={this.setHoveredIndex}
              />
            )}
            {provided.placeholder}
          </section>
        }</Droppable>
      </DragDropContext>;
    }}</Loading>;
  }

  renderNewProblemToEdit = () => {
    const spe = this.state.speGetProblems;
    const index = spe.status === 'success' ? spe.payload.problems.length + 1 : null;

    return <NewProblem
      index={index}
      courseId={this.props.courseId}
      uiAddOptimisticProblem={this.uiAddOptimisticProblem}
      uiUpdateOptimisticProblemIntoOld={this.uiUpdateOptimisticProblemIntoOld}
    />;
  }

  renderEditProblems = () =>
    <div className={css.edit}>
      <div className={`container problems-container ${this.props.My.flashcardOrder ? '-newest-first' : ''} ${this.state.idsOfCheckedProblems.length === 0 ? '-there-are-no-checked-problems' : 'there-are-checked-problems'}`}>
        {
          this.props.My.flashcardOrder &&
          this.renderNewProblemToEdit()
        }
        {this.renderOldProblemsToEdit()}
        {
          !this.props.My.flashcardOrder &&
          this.renderNewProblemToEdit()
        }
      </div>
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
    <Main dontLinkToLearnOrReview={this.props.courseId}>
      <CourseActions
        courseId={this.props.courseId}
        currentUser={this.props.currentUser}
        type="editOrShow"
        My={this.props.My}
        MyActions={this.props.MyActions}
        onProblemsImported={this.apiGetPage}
      />

      <Loading spe={this.props.My.speCourseForActions}>{({ course, coauthors }) =>
        Roles.canIEditCourse({ currentUser: this.props.currentUser, course, coauthors }) ?
          this.renderEditProblems() :
          this.renderShowProblems()
      }</Loading>
    </Main>
}

export default Page_courses_id;
