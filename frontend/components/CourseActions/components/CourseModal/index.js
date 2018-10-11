import TogglerAndModal from '~/components/TogglerAndModal';
import TabNavigation   from '~/components/TabNavigation';

import TabEditCourseDetails from './components/TabEditCourseDetails';
import TabImportExport from './components/TabImportExport';
import TabManage from './components/TabManage';

import css from './index.scss';

class CourseModal extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    uiUpdateCourse: PropTypes.func.isRequired,
    toggler: PropTypes.element.isRequired
  }

  state = {
    selectedTab: 'Course Details'
  }

  renderTabNavigation = () =>
    <TabNavigation
      selectTab={(selectedTab) => this.setState({ selectedTab })}
      selectedTab={this.state.selectedTab}
      tabs={['Course Details', 'Import/Export', 'Manage']}
    />

  renderSelectedTab = (closeModal) => {
    const props = {
      closeModal,
      tabNavigation: this.renderTabNavigation()
    };

    return {
      'Course Details': () =>
        <TabEditCourseDetails
          {...props}
          course={this.props.course}
          uiUpdateCourse={this.props.uiUpdateCourse}
        />,
      'Import/Export': () =>
        <TabImportExport
          {...props}
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
    <TogglerAndModal toggler={this.props.toggler} modalClassName={css.modal}>{(closeModal) =>
      this.renderSelectedTab(closeModal)
    }</TogglerAndModal>
}

export default CourseModal;
