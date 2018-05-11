import { Helmet } from 'react-helmet';

import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';
import { CourseForm, validate } from '~/appComponents/CourseForm';

import { browserHistory } from 'react-router';
import * as CourseApi from '~/api/Course';

import css from './index.css';

class Page_courses_new extends React.Component {
  state = {
    speSave: { status: 'success' },
    formState: {
      title: '',
      description: '',
      courseCategoryId: 1,
      ifPublic: true
    },
    formValidation: {}
  }

  apiCreateCourse = (event) => {
    event.preventDefault();
    const formValidation = validate(this.state.formState);
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

  render = () =>
    <main className={css.main}>
      <Header/>

      <div className="container">
        <h2>Create a course</h2>

        <form className="standard-form -bordered" onSubmit={this.apiCreateCourse}>
          <CourseForm
            formState={this.state.formState}
            updateFormState={(formState) => this.setState({ formState })}
            formValidation={this.state.formValidation}
          />

          <Loading spe={this.state.speSave}>
            <button
              className="button -pink standard-submit-button"
              type="submit"
            >Create</button>
          </Loading>
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
