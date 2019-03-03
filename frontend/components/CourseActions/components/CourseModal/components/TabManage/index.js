import CourseApi from '~/api/CourseApi';

import { withRouter } from "react-router-dom";
import { Loading } from '~/components/Loading';

import css from './index.css';

@withRouter
class TabManage extends React.Component {
  static propTypes = {
    tabNavigation: PropTypes.element.isRequired,
    course: PropTypes.object.isRequired
  }

  state = {
    speDelete: { status: 'success' }
  }

  apiDeleteCourse = () =>
    CourseApi.destroy(
      (spe) => this.setState({ speDelete: spe }),
      this.props.course.id
    )
      .then(() => this.props.history.push('/courses/created'))

  render = () =>
    <section className={"standard-white-heading_and_blue-content " + css.tab}>
      <div className="background -white">
        <h2 className="title">Edit Course</h2>
        {this.props.tabNavigation}
      </div>

      <div className="background -blue">
        <section className="delete-course">
          <h2 className="title">Delete Course "{this.props.course.title}"</h2>

          <article className="instructions">
            <p>
              <b>Please be careful.</b><br/>
              Upon pressing delete button, this course will get <b>immediately deleted with all of its flashcards</b> and users' progress, without the chance for restoration.
              <br/>There will be no warnings or second chances.
            </p>
          </article>

          <button type="button" className="button delete-course-button -red" onClick={this.apiDeleteCourse}>
            Delete course
          </button>
          <Loading spe={this.state.speDelete}/>
        </section>
      </div>
    </section>
}

export default TabManage;
