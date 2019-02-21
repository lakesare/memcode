import { Helmet } from 'react-helmet';

import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';
import { TextInput, EditorTextarea, Select } from '~/components/_standardForm';
import CourseCategoryFormLine from '~/appComponents/CourseCategoryFormLine';

import { browserHistory } from 'react-router';
import StandardTooltip from '~/components/StandardTooltip';
import CourseModel from '~/models/CourseModel';
import * as CourseApi from '~/api/Course';

import css from './index.css';

class Page_courses_new extends React.Component {
  state = {
    speSave: { status: 'success' },
    formState: {
      title: '',
      description: '',
      courseCategoryId: 1, // Other
      ifPublic: true
    },
    formValidation: {}
  }

  apiCreateCourse = (event) => {
    event.preventDefault();
    const formValidation = CourseModel.validateForm(this.state.formState);
    if (formValidation === true) {
      CourseApi.create(
        spe => this.setState({ speSave: spe }),
        this.state.formState
      )
        .then((course) => browserHistory.push(`/courses/${course.id}/edit`));
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
    <main className={css.main}>
      <Header/>

      <div className="container">
        <div className="standard-title-and-description">
          <h2 className="title">Create Course</h2>

          <article className="description">
            Create, study, share your own flashcards!<br/>
            You'll be able to import flashcards from Excel after creation.
          </article>
        </div>

        <form className="standard-form -bordered" onSubmit={this.apiCreateCourse}>
          <div className="form-insides">
            <TextInput      {...this.inputProps()} label="* Title:"          name="title"/>
            <EditorTextarea {...this.inputProps()} label="Description:"      name="description"/>
            <CourseCategoryFormLine {...this.inputProps()} label="Category:" name="courseCategoryId"/>
            <Select
              {...this.inputProps()}
              label={
                <span>
                  Public/Private: <StandardTooltip tooltipEl="Private courses won't be listed in /courses. Consider making your course public if other people may want to use it!"/>
                </span>
              }
              name="ifPublic"
              possibleValues={{ true: 'Public', false: "Private" }}
            />
          </div>

          <button
            className="button -pink standard-submit-button"
            type="submit"
          >Create</button>
          <Loading spe={this.state.speSave}/>
        </form>
      </div>

      <Footer/>

      <Helmet>
        <title>New Course</title>
        <meta name="description" content="Create and memorize your personal flashcards."/> :
      </Helmet>
    </main>
}

export { Page_courses_new };
