import React from 'react';
import Main from '~/appComponents/Main';

import api from '~/api';

import Loading from '~/components/Loading';
import ListOfCourseCards from '~/appComponents/ListOfCourseCards';

import css from './index.scss';


class Page_home extends React.Component {

  state = {
    speCourses: {}
  }

  componentDidMount = () => {
    api.get.CourseApi.getBest4((spe) => this.setState({ speCourses: spe }), {});
  }

  render = () =>
    <Main className={css.main}>
      <div className="container">
        <div className="space"/>

        <section className="home-section">
          <h1>4 Best Courses Of The Month</h1>
          <Loading spe={this.state.speCourses}>{({ courses }) =>
            <ListOfCourseCards courseDtos={courses} type="simple"/>
          }</Loading>
        </section>

        <section className="home-section">
          <h1>Discover Newly Created Courses</h1>
          <Loading spe={this.state.speCourses}>{({ courses }) =>
            <ListOfCourseCards courseDtos={courses} type="simple"/>
          }</Loading>
        </section>

        <section className="home-section">
          <h1>Music</h1>
          <Loading spe={this.state.speCourses}>{({ courses }) =>
            <ListOfCourseCards courseDtos={courses} type="simple"/>
          }</Loading>
        </section>

        <section className="home-section">
          <h1>Physics</h1>
          <Loading spe={this.state.speCourses}>{({ courses }) =>
            <ListOfCourseCards courseDtos={courses} type="simple"/>
          }</Loading>
        </section>

        <section className="home-section">
          <h1>Mathematics</h1>
          <Loading spe={this.state.speCourses}>{({ courses }) =>
            <ListOfCourseCards courseDtos={courses} type="simple"/>
          }</Loading>
        </section>

      </div>
    </Main>
}

export default Page_home;
