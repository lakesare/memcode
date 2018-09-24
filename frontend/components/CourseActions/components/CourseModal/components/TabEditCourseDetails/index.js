import CourseApi from '~/api/Course';

import { validate } from '~/appComponents/CourseForm';

import Loading from '~/components/Loading';
import { TextInput, EditorTextarea, Select } from '~/components/_standardForm';
import CourseCategoryFormLine from '~/appComponents/CourseForm/components/CourseCategoryFormLine';

import css from './index.scss';

class TabEditCourseDetails extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    uiUpdateCourse: PropTypes.func.isRequired,
    tabNavigation: PropTypes.element.isRequired
  }

  state = {
    speSave: { status: 'success' },
    formState: this.props.course,
    formValidation: {}
  }

  apiUpdateCourse = () => {
    const formValidation = validate(this.state.formState);
    if (formValidation === true) {
      CourseApi.update(
        (spe) => this.setState({ speSave: spe }),
        this.props.course.id,
        this.state.formState
      )
        .then(this.props.uiUpdateCourse);
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
    <section className={"white-heading_and_blue-content " + css.tab}>
      <div className="background -white">
        <h2 className="title">Edit Course</h2>
        <Loading spe={this.state.speSave}/>
        {this.props.tabNavigation}
      </div>

      <div className="background -blue">
        <form className="standard-form" onSubmit={(e) => e.preventDefault()}>

          <TextInput      {...this.inputProps()} label="* Title:"           name="title"/>
          <EditorTextarea {...this.inputProps()} label="Description:"       name="description"/>
          <CourseCategoryFormLine {...this.inputProps()} label="Category:"  name="courseCategoryId"/>

          <Select         {...this.inputProps()} label="Public or private:" name="ifPublic" possibleValues={{ true: 'Public', false: "Private" }}/>

          <Loading spe={this.state.speSave}/>
          <button
            className="button -black standard-submit-button"
            type="submit"
            onClick={this.apiUpdateCourse}
          >Save</button>
        </form>
      </div>
    </section>
}

export default TabEditCourseDetails;
