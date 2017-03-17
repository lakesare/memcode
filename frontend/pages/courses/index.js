import React from 'react';

import { Header }      from '~/components/Header';
import { Loading } from '~/components/Loading';

import { ListOfCourses } from '~/components/ListOfCourses';

import * as CourseApi from '~/api/Course';

class Page_courses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speGetCourses: {}
    };
  }

  componentDidMount = () => {
    CourseApi.index(spe => this.setState({ speGetCourses: spe }));
  }

  render = () =>
    <main>
      <Header/>
      <div className="container">
        <h1>Courses</h1>
        <Loading spe={this.state.speGetCourses}>{courses =>
          <ListOfCourses courses={courses}/>
        }</Loading>
      </div>
    </main>
}

export { Page_courses };
