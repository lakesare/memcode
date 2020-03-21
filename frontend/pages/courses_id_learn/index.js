import orFalse from '~/services/orFalse';
import { getAllActions } from '~/reducers/IdsOfProblemsToLearnAndReviewPerCourse';

import Main from '~/appComponents/Main';

import CourseActions from '~/components/CourseActions';
import Tabs from './components/Tabs';

import css from './index.css';
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
    IdsOfProblemsToLearnAndReviewPerCourseActions: getAllActions(dispatch)
  })
)
class Page extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    idsOfProblemsToLearnAndReviewPerCourse: orFalse(PropTypes.object).isRequired,
    IdsOfProblemsToLearnAndReviewPerCourseActions: PropTypes.object.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired,
    apiGetCourseForActions: PropTypes.func.isRequired,
    speCourseForActions: PropTypes.object.isRequired,
    setSpeCourseForActions: PropTypes.func.isRequired,
  }

  componentDidMount = () => {
    this.props.apiGetCourseForActions();
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.apiGetCourseForActions();
    }
  }

  render = () =>
    <Main className={css.main} dontLinkToLearnOrReview={this.props.match.params.id}>
      <CourseActions
        courseId={this.props.match.params.id}
        currentUser={this.props.currentUser}

        speCourseForActions={this.props.speCourseForActions}
        setSpeCourseForActions={this.props.setSpeCourseForActions}

        idsOfProblemsToLearnAndReviewPerCourse={this.props.idsOfProblemsToLearnAndReviewPerCourse}
        IdsOfProblemsToLearnAndReviewPerCourseActions={this.props.IdsOfProblemsToLearnAndReviewPerCourseActions}

        type="learn"
      />

      <Tabs courseId={this.props.match.params.id}/>
    </Main>
}

export default Page;
