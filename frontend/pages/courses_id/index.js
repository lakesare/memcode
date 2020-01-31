import { commonFetch } from '~/api/commonFetch';

import Main from '~/appComponents/Main';
import Loading from '~/components/Loading';
import CourseActions from '~/components/CourseActions';
import Problem from '~/components/Problem';

import css from './index.css';

class Page_courses_id extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string
      })
    }).isRequired
  }

  state = {
    speGetPage: {}
  }

  componentDidMount = () => {
    this.apiGetPage();
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.apiGetPage();
    }
  }

  apiGetPage = () =>
    commonFetch(
      spe => this.setState({ speGetPage: spe }),
      'GET', `/api/pages/courses/${this.props.match.params.id}`
    )

  render = () =>
    <Main className={css.main} key={this.props.match.params.id} dontLinkToLearnOrReview={this.props.match.params.id}>
      <CourseActions courseId={this.props.match.params.id} ifCourseDescriptionIsDisplayed ifBreadcrumbsAreDisplayed/>
      <div className="container">
        <Loading spe={this.state.speGetPage}>{(problems) =>
          <section className="problems">
            {problems.map((problem, index) =>
              <div key={problem.id} className="problem-wrapper">
                <div className="index">{index + 1}</div>
                <Problem
                  mode="show"
                  problemContent={problem.content}
                  problemType={problem.type}
                />
              </div>
            )}
          </section>
        }</Loading>
      </div>
    </Main>
}

export default Page_courses_id;
