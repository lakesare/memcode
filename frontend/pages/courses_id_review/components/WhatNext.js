import React from 'react';

import { Loading } from '~/components/Loading';
import { ListOfCourses } from '~/components/ListOfCourses';

import * as CourseApi from '~/api/Course';

class WhatNext extends React.Component {
  static propTypes = {
    courseId: React.PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { speGetCourses: {} };
  }

  componentDidMount() {
    CourseApi.selectAllLearned(
      spe => {
        // for fast UI. last problem we reviews has probably not reached server yet.
        if (spe.status === 'success') {
          const ourCourse = spe.payload.find((course) => course.course.id === this.props.courseId);
          ourCourse.amountOfProblemsToReview = 0;
        }
        this.setState({ speGetCourses: spe });
      }
    );
  }

  render = () =>
    <article className="what-next">
      <div className="space"/>
      <section className="congratulations">
        <h2>You successfully reviewed this course!</h2>
        <h3>What's next?</h3>
      </section>

      <section className="offered-courses">
        <Loading spe={this.state.speGetCourses}>{(coursesData) =>
          <ListOfCourses coursesData={coursesData.slice(0, 4)}/>
        }</Loading>
      </section>
    </article>
}

export { WhatNext };
