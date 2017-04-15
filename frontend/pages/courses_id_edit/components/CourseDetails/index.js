import React from 'react';

import { Loading } from '~/components/Loading';
import { CourseEditForm } from '~/components/CourseEditForm';

import { browserHistory } from 'react-router';
import * as CourseApi from '~/api/Course';

class CourseDetails extends React.Component {
  static propTypes = {
    course: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      ifShown: false,
      speSave: {},
      speDelete: { status: 'success' }
    };
  }

  toggle = () =>
    this.setState({ ifShown: !this.state.ifShown })

  updateCourse = (formValues) =>
    CourseApi.update(
      (spe) => this.setState({ speSave: spe }),
      this.props.course.id,
      formValues
    )

  deleteCourse = () =>
    CourseApi.destroy(
      (spe) => this.setState({ speDelete: spe }),
      this.props.course.id
    )
      .then(() => {
        browserHistory.push('profile/courses-created-by-me');
      })

  render = () =>
    <section className="edit-course">
      <div className="toggler" onClick={this.toggle}>
        <section className="edit-course">
          COURSE DETAILS
          {
            this.state.ifShown ?
              <i className="fa fa-angle-up"/> :
              <i className="fa fa-angle-down"/>
          }
        </section>
      </div>
      {
        this.state.ifShown &&
        <div className="modal">
          <div className="delete-course" onClick={this.deleteCourse}>
            <Loading spe={this.state.speDelete}>
              <div>Delete course</div>
            </Loading>
          </div>

          <CourseEditForm
            save={this.updateCourse}
            speSave={this.state.speSave}
            initialValues={this.props.course}
            buttonText="Save"
          />
        </div>
      }
    </section>
}

export { CourseDetails };
