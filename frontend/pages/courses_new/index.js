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
      speCreateCourse: {},
      validationErrors: {},
      formValues: {
        title: ''
      }
    };
  }

  updateFormValues = (event, inputTitle) => {
    this.setState({
      formValues: {
        ...this.state.formValues,
        [inputTitle]: event.target.value
      }
    });
  }

  validateAndSubmit = (e) => {
    e.preventDefault();
    if (this.validate()) this.apiCreateCourse();
  }

  validate = () => {
    if (this.state.formValues.title.length < 2) {
      this.setState({ validationErrors: { title: 'Title must be longer than 2 letters' } });
      return false;
    } else {
      return true;
    }
  }

  apiCreateCourse = () =>
    CourseApi.create(
      spe => this.setState({ speCreateCourse: spe }),
      { title: this.state.formValues.title }
    )
      .then((course) => {
        browserHistory.push(`/courses/${course.id}/edit`);
      })

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
              <input type="text" onChange={(e) => this.updateFormValues(e, 'title')} value={this.state.formValues.title}/>
            </div>
            {
              this.state.validationErrors.title &&
              <div className="error">
                {this.state.validationErrors.title}
              </div>
            }
          </div>

          <button
            className="button -black"
            onClick={this.validateAndSubmit}
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
