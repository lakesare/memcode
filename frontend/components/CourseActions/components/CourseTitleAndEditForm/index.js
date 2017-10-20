import { orFalse } from '~/services/orFalse';
import { Link } from 'react-router';

import * as CourseApi from '~/api/Course';
import { url } from '~/services/url';

import { Loading } from '~/components/Loading';
import { TogglerAndModal } from '~/components/TogglerAndModal';
import { CourseForm, validate } from '~/appComponents/CourseForm';

import css from './index.css';

class CourseTitleAndEditForm extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    uiUpdateCourse: PropTypes.func.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired,
    ifEditCourseModalTogglerIsDisplayed: PropTypes.bool.isRequired
  }

  state = {
    speSave: { status: 'success' },
    speDelete: {},
    formState: this.props.course,
    formValidation: {}
  }

  // deleteCourse = () =>
  //   CourseApi.destroy(
  //     (spe) => this.setState({ speDelete: spe }),
  //     this.props.course.id
  //   )
  //     .then(() => {
  //       browserHistory.push('profile/created');
  //     })

  apiUpdateCourse = (closeModal) => {
    const formValidation = validate(this.state.formState);
    if (formValidation === true) {
      CourseApi.update(
        (spe) => this.setState({ speSave: spe }),
        this.props.course.id,
        this.state.formState
      )
        .then(this.props.uiUpdateCourse)
        .then(closeModal);
    } else {
      this.setState({ formValidation });
    }
  }

  render = () =>
    <section className="course-title-and-edit-form">
      <h3 className="title">
        <Link to={url.courseEditOrShow(this.props.currentUser, this.props.course)}>
          {this.props.course.title}
        </Link>
      </h3>

      {
        this.props.ifEditCourseModalTogglerIsDisplayed &&
        this.props.currentUser &&
        <TogglerAndModal
          toggler={
            <button className="edit-button" type="button">
              <i className="fa fa-hand-pointer-o"/> EDIT
            </button>
          }
        >{(closeModal) =>
          <div className={`${css['modal-insides']} container`}>
            <div className="standard-form -bordered">
              <div className="delete-course" onClick={this.deleteCourse}>
                <Loading spe={this.state.speDelete}>
                  <div>Delete course</div>
                </Loading>
              </div>

              <CourseForm
                formState={this.state.formState}
                updateFormState={(formState) => this.setState({ formState })}
                formValidation={this.state.formValidation}
              />

              <Loading spe={this.state.speSave}>
                <button
                  className="button -black standard-submit-button"
                  type="submit"
                  onClick={() => this.apiUpdateCourse(closeModal)}
                >Save</button>
              </Loading>
            </div>
          </div>
        }</TogglerAndModal>
      }
    </section>
}

export { CourseTitleAndEditForm };
