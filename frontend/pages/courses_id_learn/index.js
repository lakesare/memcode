import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';

import { Loading } from '~/components/Loading';
import { CourseActions } from '~/components/CourseActions';
import { ListOfProblems } from './components/ListOfProblems';
import { Instructions } from './components/Instructions';

import { commonFetch } from '~/api/commonFetch';

import css from './index.css';

class Page_courses_id_learn extends React.Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string
    }).isRequired
  }

  state = { speGetPage: {} }

  componentDidMount = () =>
    commonFetch(
      (spe) => this.setState({ speGetPage: spe }),
      'GET', `/api/pages/courses/${this.props.params.id}/learn`
    )

  render = () =>
    <main className={css.main}>
      <Header/>

      <Loading spe={this.state.speGetPage}>{({ problems, courseUserIsLearning }) =>
        <div className="container">
          <CourseActions courseId={this.props.params.id} ifCuilActivityButtonsAreDisplayed={false}/>
          <Instructions/>
          <ListOfProblems problems={problems} courseUserIsLearningId={courseUserIsLearning.id}/>
        </div>
      }</Loading>

      <Footer/>
    </main>
}

export { Page_courses_id_learn };
