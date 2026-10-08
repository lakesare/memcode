import api from '~/api';
import withOfflineFallback from '~/services/offline/withOfflineFallback';
import offlineFallbacks from '~/services/offline/fallbacks';
import tempIds from '~/services/offline/tempIds';
import { Loading } from '~/components/Loading';
import { TabNavigation } from './components/TabNavigation';
import { TabContent } from './components/TabContent';

// ___why is there a /tabs/index.js folder in git! but not in a working directory!
//   okay, so there is some weird ios VS git folder capitalization shit going on.
//   happens when we change capitalization of a folder.
//   https://stackoverflow.com/questions/6899582/i-change-the-capitalization-of-a-directory-and-git-doesnt-seem-to-pick-up-on-it
class Tabs extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired
  }

  state = {
    currentTab: 'notLearned',
    speGetPage: {}
  }

  componentDidMount = () =>
    this.apiGetProblems()

  componentDidUpdate = (prevProps) => {
    if (prevProps.courseId !== this.props.courseId) {
      this.apiGetProblems();
    }
  }

  apiGetProblems = () => {
    const courseId = this.props.courseId;
    return withOfflineFallback(
      (spe) => this.setState({ speGetPage: spe }),
      (dispatchSpe) => api.get.PageApi.getLearnPage(dispatchSpe, { courseId }),
      () => offlineFallbacks.getLearnPage(courseId),
      { ifOnlyOffline: tempIds.isTempId(courseId) }
    );
  }

  updateCurrentTab = (tabId) => {
    this.apiGetProblems();
    this.setState({ currentTab: tabId });
  }

  uiRemoveProblem = (problemId) => {
    // Update local state to remove the problem immediately for UI responsiveness
    this.setState((prevState) => ({
      speGetPage: {
        ...prevState.speGetPage,
        payload: {
          ...prevState.speGetPage.payload,
          problems: prevState.speGetPage.payload.problems.filter(p => p.id !== problemId),
          problemUserIsLearnings: prevState.speGetPage.payload.problemUserIsLearnings.filter(puil => puil.problemId !== problemId)
        }
      }
    }));
  }

  render = () =>
    <>
      <TabNavigation currentTab={this.state.currentTab} updateCurrentTab={this.updateCurrentTab}/>

      <Loading spe={this.state.speGetPage}>{({ problems, problemUserIsLearnings }) =>
        <TabContent
          currentTab={this.state.currentTab}
          problems={problems}
          puils={problemUserIsLearnings}
          uiRemoveProblem={this.uiRemoveProblem}
        />
      }</Loading>
    </>
}

export { Tabs };
export default Tabs
