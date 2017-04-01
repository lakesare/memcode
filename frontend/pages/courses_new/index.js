import React from 'react';

import { Header } from '~/components/Header';
import { Loading } from '~/components/Loading';

import { browserHistory } from 'react-router';

import * as CourseApi from '~/api/Course';

import css from './index.css';

class Page_courses_new extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      speCreateCourse: {}
    };

    this.references = {
      title: null
    };
  }

  onKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.apiCreateCourse();
    }
  }

  apiCreateCourse = () =>
    CourseApi.create(
      spe => this.setState({ speCreateCourse: spe }),
      { title: this.references.title.value }
    ).then((courseId) => {
      browserHistory.push(`/courses/${courseId}/edit`);
    });

  render = () =>
    <main className={css.main}>
      <Header/>

      <div className="container">
        <form>
          <h2>Create a course</h2>

          {/* not real field because it can't be flexbox */}
          <div className="fieldset">
            <div className="label">
              <label htmlFor="title">Title:</label>
            </div>
            <div className="input">
              <input id="title" type="text" onKeyDown={this.onKeyDown} ref={ref => this.references.title = ref}/>
            </div>
          </div>

          <button
            className="button -black"
            onClick={this.apiCreateCourse}
            disabled={this.state.speCreateCourse.status === 'request'}
          >
            Create!
          </button>
          <Loading spe={this.state.speCreateCourse}/>
        </form>
      </div>
    </main>
}

export { Page_courses_new };
