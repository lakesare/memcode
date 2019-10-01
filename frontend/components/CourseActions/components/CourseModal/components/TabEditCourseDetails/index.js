import CourseApi from '~/api/CourseApi';
import CourseModel from '~/models/CourseModel';

import Loading from '~/components/Loading';
import StandardTooltip from '~/components/StandardTooltip';
import { TextInput, EditorTextarea, Select } from '~/components/_standardForm';
import CourseCategoryFormLine from '~/appComponents/CourseCategoryFormLine';

import css from './index.scss';

class TabEditCourseDetails extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    course: PropTypes.object.isRequired,
    uiUpdateCourse: PropTypes.func.isRequired
  }

  state = {
    speSave: {},
    formState: this.props.course,
    formValidation: {}
  }

  apiUpdateCourse = () => {
    const formValidation = CourseModel.validateForm(this.state.formState);
    if (formValidation === true) {
      CourseApi.update(
        (spe) => this.setState({ speSave: spe }),
        this.props.course.id,
        this.state.formState
      )
        .then(this.props.uiUpdateCourse)
        .then(() => {
          setTimeout(this.props.closeModal, 2000);
        });
    } else {
      this.setState({ formValidation });
    }
  }

  inputProps = () => ({
    formState: this.state.formState,
    updateFormState: (formState) => this.setState({ formState }),
    formValidation: this.state.formValidation
  })

  render = () =>
    <div className={css.tab}>
      <form className="standard-form" onSubmit={(e) => e.preventDefault()}>

        <div className="form-insides">
          <TextInput      {...this.inputProps()} label="* Title" name="title"/>

          <EditorTextarea {...this.inputProps()} label="Description:"       name="description"/>

          <div className="two-form-lines-in-row">
            <CourseCategoryFormLine {...this.inputProps()} label="Category" name="courseCategoryId"/>
            <Select
              {...this.inputProps()}
              label={
                <span>
                  Public/Private <StandardTooltip tooltipEl="Private courses won't be listed in /courses. Consider making your course public if other people may want to use it!"/>
                </span>
              }
              name="ifPublic"
              possibleValues={{ true: 'Public', false: "Private" }}
            />
          </div>
        </div>

        <button
          className="button -purple standard-submit-button"
          type="submit"
          onClick={this.apiUpdateCourse}
        >Update</button>

        <Loading spe={this.state.speSave}>{() =>
          <div className="standard-success-message">
            Course was successfully updated.
          </div>
        }</Loading>
      </form>
    </div>
}

export default TabEditCourseDetails;
