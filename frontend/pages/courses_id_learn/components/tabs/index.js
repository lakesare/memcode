import { commonFetch } from '~/api/commonFetch';
import { Loading } from '~/components/Loading';
import { NotLearnedProblems } from './components/NotLearnedProblems';

class Tabs extends React.Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired
  }

  state = {
    currentTab: 'notLearned',
    speGetPage: {}
  }

  componentDidMount = () =>
    this.apiGetProblems()

  apiGetProblems = () =>
    commonFetch(
      (spe) => this.setState({ speGetPage: spe }),
      'GET', `/api/pages/courses/${this.props.courseId}/learn`
    )

  renderTabLink = (tabId, caption) =>
    <li
      onClick={() => this.setState({ currentTab: tabId })}
      className={this.state.currentTab === tabId ? '-active' : '-not-active'}
    >{caption}</li>

  renderTabNavigation = () =>
    <ul className="tab-navigation">
      {this.renderTabLink('notLearned', 'Flashcards to learn')}
      {this.renderTabLink('ignored', 'Ignored flashcards')}
      {this.renderTabLink('learned', "Learned flashcards (you're reviewing them)")}
    </ul>

  renderTab = (currentTab, courseUserIsLearning, problems) => {
    switch (currentTab) {
      case 'notLearned':
        return <NotLearnedProblems courseId={this.props.courseId} cuilId={courseUserIsLearning.id} problemResponses={problems}/>;
      case 'ignored':
        return null;
      case 'learned':
        return null;
      default:
        throw new Error(`No such tab name: ${currentTab}.`);
    }
  }

  render = () =>
    <div>
      {this.renderTabNavigation()}
      <Loading spe={this.state.speGetPage}>{({ courseUserIsLearning, problems }) =>
        this.renderTab(this.state.currentTab, courseUserIsLearning, problems)
      }</Loading>
    </div>
}

export { Tabs };
