import { browserHistory } from 'react-router';
import * as CourseApi from '~/api/Course';

import onClickOutside from 'react-onclickoutside';
import { Loading } from '~/components/Loading';
import { CourseEditForm } from '~/components/CourseEditForm';

import css from './index.css';

@onClickOutside
class CourseDetails extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    uiUpdateCourse: PropTypes.func.isRequired
  }

  state = {
    ifShown: false,
    speSave: {},
    speDelete: { status: 'success' }
  }

  handleClickOutside = () =>
    this.setState({ ifShown: false })

  toggle = () =>
    this.setState({ ifShown: !this.state.ifShown })

  updateCourse = (formValues) =>
    CourseApi.update(
      (spe) => this.setState({ speSave: spe }),
      this.props.course.id,
      formValues
    )
    .then((course) => {
      this.props.uiUpdateCourse(course);
      this.setState({ ifShown: false });
    })

  deleteCourse = () =>
    CourseApi.destroy(
      (spe) => this.setState({ speDelete: spe }),
      this.props.course.id
    )
      .then(() => {
        browserHistory.push('profile/created');
      })

  render = () =>
    <section className={css['course-details']}>
      <div className="toggler" onClick={this.toggle}>
        <section className="edit-course">
          COURSE DETAILS
          {
            this.state.ifShown ?
              <i className="fa fa-angle-up"/> :
              <i className="fa fa-angle-down"/>
          }
        </section>
      </div>
      {
        this.state.ifShown &&
        <div className="modal">
          <div className="delete-course" onClick={this.deleteCourse}>
            <Loading spe={this.state.speDelete}>
              <div>Delete course</div>
            </Loading>
          </div>

          <CourseEditForm
            save={this.updateCourse}
            speSave={this.state.speSave}
            initialValues={this.props.course}
            buttonText="Save"
          />
        </div>
      }
    </section>
}

export { CourseDetails };
