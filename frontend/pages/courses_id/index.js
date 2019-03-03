import { commonFetch } from '~/api/commonFetch';

import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';
import { CourseActions } from '~/components/CourseActions';
import { Problem } from '~/components/Problem';

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
    <main className={css.main} key={this.props.match.params.id}>
      <Header dontLinkToLearnOrReview={this.props.match.params.id}/>

      <CourseActions courseId={this.props.match.params.id} ifCourseDescriptionIsDisplayed ifBreadcrumbsAreDisplayed/>
      <div className="container">
        <Loading spe={this.state.speGetPage}>{(problems) =>
          <section className="problems">
            {problems.map((problem) =>
              <Problem
                key={problem.id}
                mode="show"
                problemContent={problem.content}
                problemType={problem.type}
              />
            )}
          </section>
        }</Loading>
      </div>

      <Footer/>
    </main>
}

export default Page_courses_id;
