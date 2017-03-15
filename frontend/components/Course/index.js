import React from 'react';
import { Link } from 'react-router';

import css from './index.css';

class Course extends React.Component {
  static propTypes = {
    course: React.PropTypes.object.isRequired,
  }

  renderActions = (course) =>
    <section className="actions">
      <Link
        className="edit"
        to={`/courses/${course.id}/edit`}
      >
        <i className="fa fa-pencil-square-o"/>
      </Link>

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

      <div className="amount-of-mems-to-review-and-learn">
        <div className="to-review">
          3 to review
        </div>
        <div className="to-learn">
          20 to learn
        </div>
      </div>

      <div className="review-and-learn-more">
        <Link className="review" to={`/courses/${course.id}/review`} >
          REVIEW
        </Link>
        <Link className="learn-more" to={`/courses/${course.id}`} >
          LEARN
        </Link>
      </div>
    </section>

  renderTotalAmountOfMems = (course) =>
    <section className="total-amount-of-mems">
      {course.amountOfProblems} mems
    </section>

  render = () =>
    <div className={css.course}>
      {this.renderActions(this.props.course)}
      {this.renderMain(this.props.course)}

      {this.renderTotalAmountOfMems(this.props.course)}
    </div>
}

export { Course };
