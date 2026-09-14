import TogglerAndModal from '~/components/TogglerAndModal';
import TabNavigation   from '~/components/TabNavigation';

import TabEditCourseDetails from './components/TabEditCourseDetails';
import TabInviteCoauthors from './components/TabInviteCoauthors';
import TabEmbed from './components/TabEmbed';
import TabManage from './components/TabManage';

import css from './index.scss';

class CourseModal extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    uiUpdateCourse: PropTypes.func.isRequired,
    toggler: PropTypes.element.isRequired,
    MyActions: PropTypes.object.isRequired,
    author: PropTypes.object,
    coauthors: PropTypes.array
  }

  state = {
    selectedTab: 'Course Details'
  }

  ifCanInviteCoauthors = () =>
    Boolean(this.props.author && this.props.coauthors)

  getTabs = () => [
    'Course Details',
    ...(this.ifCanInviteCoauthors() ? ['Invite Coauthors'] : []),
    'Embed',
    'Manage'
  ]

  renderTabNavigation = () =>
    <TabNavigation
      selectTab={(selectedTab) => this.setState({ selectedTab })}
      selectedTab={this.state.selectedTab}
      tabs={this.getTabs()}
    />

  renderSelectedTab = (closeModal) => {
    const props = { closeModal };

    return {
      'Course Details': () =>
        <TabEditCourseDetails
          {...props}
          course={this.props.course}
          uiUpdateCourse={this.props.uiUpdateCourse}
        />,
      'Invite Coauthors': () =>
        <TabInviteCoauthors
          {...props}
          course={this.props.course}
          author={this.props.author}
          coauthors={this.props.coauthors}
        />,
      'Embed': () =>
        <TabEmbed
          course={this.props.course}
        />,
      'Manage': () =>
        <TabManage
          {...props}
          course={this.props.course}
        />
    }[this.state.selectedTab]();
  }

  render = () =>
    <TogglerAndModal toggler={this.props.toggler} className={css.modal}>{(closeModal) =>
      <section className={"standard-modal " + css.tab}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Edit Course</h2>
          {this.renderTabNavigation()}
        </div>

        <div className="standard-modal__main">
          {this.renderSelectedTab(closeModal)}
        </div>
      </section>
    }</TogglerAndModal>
}

export default CourseModal;
