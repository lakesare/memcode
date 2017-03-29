import React from 'react';

import { Course } from './components/Course';

import css from './index.css';

class ListOfCourses extends React.Component {
  static propTypes = {
    coursesData: React.PropTypes.array.isRequired,
  }

  renderLayoutDivs = () =>
    // eslint-disable-next-line react/no-array-index-key
    [...Array(10)].map((_, i) => <div key={i} style={{ width: 150 }}/>)

  render = () =>
    <section className={css['list-of-courses']}>
      {
        this.props.coursesData.map(({ course, courseUserIsLearning, amountOfProblems, amountOfProblemsToReview, amountOfProblemsToLearn }) =>
          <Course
            key={course.id}
            course={course}
            courseUserIsLearning={courseUserIsLearning}
            amountOfProblems={amountOfProblems}
            amountOfProblemsToReview={amountOfProblemsToReview}
            amountOfProblemsToLearn={amountOfProblemsToLearn}
          />
        )
      }
      {this.renderLayoutDivs()}
    </section>
}

export { ListOfCourses };
