import React from 'react';

import { Link } from 'react-router';
import { Header }      from '~/components/Header';
import { Loading } from '~/components/Loading';
import { ListOfCourses } from '~/components/ListOfCourses';

import * as CourseUserIsLearningApi from '~/api/CourseUserIsLearning';

class Page_profile_coursesLearnedByMe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speGetCourses: {}
    };
  }

  componentDidMount = () => {
    CourseUserIsLearningApi.coursesWithDueProblems(
      spe => this.setState({ speGetCourses: spe }),
    );
  }

  render = () =>
    <main>
      <Header/>
      <div className="container">
        <nav>
          <Link to="/profile/courses-learned-by-me">courses I'm learning</Link>
          <Link to="/profile/courses-created-by-me">courses I created</Link>
        </nav>

        <Loading spe={this.state.speGetCourses}>{courses =>
          <ListOfCourses courses={courses} isDisplayed={{ reviewAndLearn: true }} />
        }</Loading>
      </div>
    </main>
}

export { Page_profile_coursesLearnedByMe };
