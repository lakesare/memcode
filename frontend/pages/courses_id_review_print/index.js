import orFalse from '~/services/orFalse';

import Main from '~/appComponents/Main';
import Loading from '~/components/Loading';
import CourseActions from '~/components/CourseActions';
import Problem from '~/components/Problem';

import css from './index.scss';
import MyDuck from '~/ducks/MyDuck';

import api from '~/api';

@connect(
  (state, ownProps) => {
    const pageState = state.pages.Page_courses_id_review;
    return {
      courseId: Number.parseInt(ownProps.match.params.id),
      currentUser: state.global.Authentication.currentUser || false,
      ...pageState.speGetPage.status === 'success' &&
        {
          statusOfSolving:  pageState.statusOfSolving,
          amountOfProblems: pageState.speGetPage.payload.problems.length
        },
      amountOfFailedProblems: pageState.amountOfFailedProblems,
      amountOfFailedProblemsLeft: pageState.indexesOfFailedProblems.length,

      My: state.global.My
    };
  },
  (dispatch) => ({
    MyActions: dispatch(MyDuck.getActions)
  })
)
class Page_courses_id_review extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired,

    MyActions: PropTypes.object.isRequired,
    My: PropTypes.object.isRequired
  }

  state = {
    speGetPage: {}
  }

  componentDidMount = () => {
    api.get.PageApi.getReviewPage(
      (spe) => this.setState({ speGetPage: spe }),
      { courseId: this.props.courseId }
    );
    this.props.MyActions.apiGetCourseForActions(this.props.courseId);
  }

  render = () =>
    <Main className={`${css.main} -bright-theme`}>
      <CourseActions
        courseId={this.props.courseId}
        currentUser={this.props.currentUser}
        type="review"
        My={this.props.My}
        MyActions={this.props.MyActions}
      />

      <Loading spe={this.state.speGetPage}>{({ problems }) =>
        <div className="container">{
          problems.map((problem, index) =>
            <div className="problem-wrapper">
              <div className="index">{index + 1}</div>
              <Problem
                key={problem.id}
                mode="show"
                problemContent={problem.content}
                problemType={problem.type}
              />
            </div>
          )
        }</div>
      }</Loading>
    </Main>
}

export default Page_courses_id_review;
