import orFalse from '~/services/orFalse';

import Main from '~/appComponents/Main';
import Loading from '~/components/Loading';
import CourseActions from '~/components/CourseActions';
import Problem from '~/components/Problem';

import css from './index.scss';
import MyDuck from '~/ducks/MyDuck';
import SettingsDuck from '~/ducks/SettingsDuck';

import api from '~/api';
import withRouter from '~/services/withRouter';

class Page_courses_id_print extends React.Component {
  static propTypes = {
    kind: PropTypes.oneOf(['all', 'due', 'learned']).isRequired,
    courseId: PropTypes.number.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired,

    MyActions: PropTypes.object.isRequired,
    SettingsActions: PropTypes.object.isRequired,
    My: PropTypes.object.isRequired,
    Settings: PropTypes.object.isRequired
  }

  state = {
    speGetPage: {}
  }

  deriveApiMethod = () => ({
    all:     api.get.PageApi.getCoursePage,
    due:     api.get.PageApi.getReviewPage,
    learned: api.get.PageApi.getAllPage
  }[this.props.kind])

  componentDidMount = () => {
    this.deriveApiMethod()(
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
        Settings={this.props.Settings}
        MyActions={this.props.MyActions}
        SettingsActions={this.props.SettingsActions}
      />

      <Loading spe={this.state.speGetPage}>{({ problems }) =>
        <div className="container">{
          problems.map((problem, index) =>
            <div className="problem-wrapper" key={problem.id}>
              <div className="index">{index + 1}</div>
              <Problem
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

export default withRouter(connect(
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
)(Page_courses_id_print));
