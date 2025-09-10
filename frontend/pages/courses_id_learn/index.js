import orFalse from '~/services/orFalse';

import Main from '~/appComponents/Main';
import CourseActions from '~/components/CourseActions';
import Tabs from './components/Tabs';

import css from './index.scss';
import MyDuck from '~/ducks/MyDuck';
import SettingsDuck from '~/ducks/SettingsDuck';

@connect(
  (state, ownProps) => ({
    courseId: Number.parseInt(ownProps.match.params.id),
    currentUser: state.global.Authentication.currentUser || false,
    My: state.global.My,
    Settings: state.global.Settings
  }),
  (dispatch) => ({
    MyActions: dispatch(MyDuck.getActions),
    SettingsActions: SettingsDuck.getActions(dispatch)
  })
)
class Page extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired,
    MyActions: PropTypes.object.isRequired,
    SettingsActions: PropTypes.object.isRequired,
    My: PropTypes.object.isRequired,
    Settings: PropTypes.object.isRequired
  }

  componentDidMount = () => {
    this.props.MyActions.apiGetCourseForActions(this.props.courseId);
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.courseId !== this.props.courseId) {
      this.props.MyActions.apiGetCourseForActions(this.props.courseId);
    }
  }

  render = () =>
    <Main className={css.main} dontLinkToLearnOrReview={this.props.courseId}>
      <CourseActions
        courseId={this.props.courseId}
        currentUser={this.props.currentUser}
        type="learn"
        My={this.props.My}
        Settings={this.props.Settings}
        MyActions={this.props.MyActions}
        SettingsActions={this.props.SettingsActions}
      />

      <Tabs courseId={this.props.courseId}/>
    </Main>
}

export default Page;
