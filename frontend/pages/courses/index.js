import React from 'react';

import { Header }      from '~/components/Header';
import { Loading } from '~/components/Loading';

import { Course } from './components/course';

import { apiGetCourses } from '~/ducks/courses/actions';

import css from './index.css';

class Page_courses extends React.Component {
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
          <section className="list-of-courses">
            {courses.map(course => <Course key={course.id} course={course}/>)}
          </section>
        }</Loading>
      </div>
    </main>
}

export { Page_courses };
