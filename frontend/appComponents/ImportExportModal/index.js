import TogglerAndModal from '~/components/TogglerAndModal';
import TabNavigation from '~/components/TabNavigation';
import TabText from './components/TabText';
import TabExcel from './components/TabExcel';
import css from './index.scss';

class ImportExportModal extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    toggler: PropTypes.element.isRequired,
    MyActions: PropTypes.object.isRequired,
    onProblemsImported: PropTypes.func
  }

  state = {
    selectedTab: 'Text'
  }

  renderTabNavigation = () =>
    <TabNavigation
      selectTab={(selectedTab) => this.setState({ selectedTab })}
      selectedTab={this.state.selectedTab}
      tabs={['Text', 'Excel']}
    />

  renderSelectedTab = (closeModal) => {
    const props = {
      courseId: this.props.course.id,
      course: this.props.course,
      MyActions: this.props.MyActions,
      onProblemsImported: this.props.onProblemsImported,
      closeModal
    };

    return {
      'Text': () => <TabText {...props} />,
      'Excel': () => <TabExcel {...props} />
    }[this.state.selectedTab]();
  }

  render = () =>
    <TogglerAndModal toggler={this.props.toggler} className={css.modal}>{(closeModal) =>
      <section className={"standard-modal standard-modal--md " + css.tab}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Import/Export Flashcards</h2>
          {this.renderTabNavigation()}
        </div>

        <div className="standard-modal__main">
          <div className={css.modal}>
            <div className="background -blue">
              {this.renderSelectedTab(closeModal)}
            </div>
          </div>
        </div>
      </section>
    }</TogglerAndModal>
}

export default ImportExportModal;
