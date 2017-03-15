import React from 'react';
import { Link } from 'react-router';

import css from './index.css';

class ListOfCourses extends React.Component {
  static propTypes = {
    courses: React.PropTypes.array.isRequired,
    isDisplayed: React.PropTypes.shape({
      reviewAndLearn: React.PropTypes.bool,
      edit:   React.PropTypes.bool
    })
  }

  static defaultProps = {
    isDisplayed: {
      reviewAndLearn: false,
      edit: false
    }
  }

  renderActions = (course) =>
    <section className="actions">
      {
        this.props.isDisplayed.edit &&
        <Link
          className="edit"
          to={`/courses/${course.id}/edit`}
        >
          <i className="fa fa-pencil-square-o"/>
        </Link>
      }

      <Link
        className="view"
        to={`/courses/${course.id}`}
      >
        <i className="fa fa-eye"/>
      </Link>
    </section>

  renderMain = (course) =>
    <section className="main">
      <h5 className="title">{course.title}</h5>

      {
        this.props.isDisplayed.reviewAndLearn &&
        <div className="amount-of-mems-to-review-and-learn">
          <div className="to-review">
            {course.amountOfDueProblems} to review
          </div>
          <div className="to-learn">
            20 to learn
          </div>
        </div>
      }

      {
        this.props.isDisplayed.reviewAndLearn &&
        <div className="review-and-learn-more">
          <Link className="review" to={`/courses/${course.courseUserIsLearningId}/review`} >
            REVIEW
          </Link>
          <Link className="learn-more" to={`/courses/${course.id}`} >
            LEARN
          </Link>
        </div>
      }
    </section>

  renderTotalAmountOfMems = (course) =>
    <section className="total-amount-of-mems">
      {course.amountOfProblems} mems
    </section>

  render = () =>
    <section className={css['list-of-courses']}>
      {
        this.props.courses.map(course =>
          <div className="course" key={course.id}>
            {this.renderActions(course)}
            {this.renderMain(course)}

            {this.renderTotalAmountOfMems(course)}
          </div>
        )
      }
      {
        [...Array(10)].map((_, i) => <div key={i} style={{ width: 150 }}/>)
      }
    </section>
}

export { ListOfCourses };
