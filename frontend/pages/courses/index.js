import React from 'react';

import { Header }      from '~/components/header';
import { CoursesList } from '~/components/courses';
import { Loading } from '~/components/Loading';

import { apiGetCourses } from '~/ducks/courses/actions';

import css from './index.css';

class CoursesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speGetCourses: {}
    };
  }

  componentDidMount = () => {
    apiGetCourses(spe => this.setState({ speGetCourses: spe }));
  }

  render = () =>
    <main className={css.main}>
      <Header/>
      <div className="container">
        <h1>Courses</h1>
        <Loading spe={this.state.speGetCourses}>{courses =>
          <CoursesList courses={courses} />
        }</Loading>
      </div>
    </main>
}

export { CoursesPage };
