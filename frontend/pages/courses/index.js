import React from 'react';

import { Header } from '~/components/Header';
import { Loading } from '~/components/Loading';
import { Course } from './components/Course';

import listOfCoursesCss from '~/components/ListOfCourses/index.css';
import css from './index.css';

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

  renderLayoutDivs = () =>
    // eslint-disable-next-line react/no-array-index-key
    [...Array(10)].map((_, i) => <div key={i} style={{ width: 150 }}/>)

  render = () =>
    <main className={css.main}>
      <Header/>
      <div className="container">
        <div className="space"/>
        <Loading spe={this.state.speGetCourses}>{courses =>
          <section className={listOfCoursesCss['list-of-courses']}>
            {
              courses.map(({ course, amountOfProblems }) =>
                <Course key={course.id} course={course} amountOfProblems={amountOfProblems}/>
              )
            }
            {this.renderLayoutDivs()}
          </section>
        }</Loading>
      </div>
    </main>
}

export { Page_courses };
