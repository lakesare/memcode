
import { Loading } from '~/components/Loading';


import { commonFetch } from '~/api/commonFetch';

import css from './index.css';

class Page_courses_id_learn extends React.Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string
    }).isRequired
  }

  state = {
    speGetPage: {},
    currentTab: 'toLearn'
  }

  componentDidMount = () =>
    this.apiGetPage()

  apiGetPage = () =>
    commonFetch(
      (spe) => this.setState({ speGetPage: spe }),
      'GET', `/api/pages/courses/${this.props.params.id}/learn`
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

  render = () =>
    <div>
      {this.renderTabNavigation()}


      <Loading spe={this.state.speGetPage}>{({ problems, courseUserIsLearning }) =>
        <ListOfProblems/>
      }</Loading>

      <Footer/>
    </div>
}

export { Page_courses_id_learn };
