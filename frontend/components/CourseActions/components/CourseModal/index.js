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
    const props = { closeModal };

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
