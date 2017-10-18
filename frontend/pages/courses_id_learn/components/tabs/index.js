import { commonFetch } from '~/api/commonFetch';
import { Loading } from '~/components/Loading';
import { TabNavigation } from './components/TabNavigation';
import { TabContent } from './components/TabContent';

// ___why is there a /tabs/index.js folder in git! but not in a working directory!
//   okay, so there is some weird ios VS git folder capitalization shit going on.
//   happens when we change capitalization of a folder.
//   https://stackoverflow.com/questions/6899582/i-change-the-capitalization-of-a-directory-and-git-doesnt-seem-to-pick-up-on-it
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

  updateCurrentTab = (tabId) => {
    this.apiGetProblems();
    this.setState({ currentTab: tabId });
  }

  render = () =>
    <div className="tabs">
      <TabNavigation currentTab={this.state.currentTab} updateCurrentTab={this.updateCurrentTab}/>

      <Loading spe={this.state.speGetPage}>{({ problems, problemUserIsLearnings }) =>
        <TabContent currentTab={this.state.currentTab} problems={problems} puils={problemUserIsLearnings}/>
      }</Loading>
    </div>
}

export { Tabs };
