import { Helmet } from 'react-helmet';

import { Header } from '~/components/Header';
import { CourseEditForm } from '~/components/CourseEditForm';

import { browserHistory } from 'react-router';
import * as CourseApi from '~/api/Course';

import css from './index.css';

class Page_courses_new extends React.Component {
  constructor(props) {
    super(props);
    this.state = { speSave: {} };
  }

  apiCreateCourse = (formValues) =>
    CourseApi.create(
      spe => this.setState({ speSave: spe }),
      formValues
    )
      .then((course) => {
        browserHistory.push(`/courses/${course.id}/edit`);
      })

  render = () =>
    <main className={css.main}>
      <Header/>

      <div className="container">
        <h2>Create a course</h2>
        <CourseEditForm save={this.apiCreateCourse} speSave={this.state.speSave} buttonText="Create!"/>
      </div>

      <Helmet>
        <title>New Course</title>
        <meta name="description" content="Create and memorize your personal flashcards."/> :
      </Helmet>
    </main>
}

export { Page_courses_new };
