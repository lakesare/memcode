import React from 'react';

import { Header } from '~/components/Header';
import { browserHistory } from 'react-router';

import * as CourseApi from '~/api/Course';

class Page_courses_new extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      speCreateCourse: {}
    };
  }

  onKeyDown = (event) => {
    if (event.keyCode === 13) {
      const title = event.target.value;
      this.apiCreateCourse(title);
    }
  }

  apiCreateCourse = (title) => {
    CourseApi.create(
      spe => this.setState({ speCreateCourse: spe }),
      { title }
    ).then((response) => {
      browserHistory.push(`/courses/${response.courseId}/edit`);
    });
  }

  render = () =>
    <main>
      <Header/>

      <div className="container">
        <div>
          <input onKeyDown={this.onKeyDown}/>
        </div>
      </div>
    </main>
}

export { Page_courses_new };
