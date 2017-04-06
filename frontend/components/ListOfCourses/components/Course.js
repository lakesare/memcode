import React from 'react';

import { Link } from 'react-router';
import { ReviewAndLearn } from './ReviewAndLearn';

class Course extends React.Component {
  static propTypes = {
    course: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object.isRequired,

    courseUserIsLearning: React.PropTypes.object,
    amountOfProblemsToLearn: React.PropTypes.number.isRequired,
    amountOfProblemsToReview: React.PropTypes.number.isRequired,
    amountOfProblems: React.PropTypes.number.isRequired
  }

  static defaultProps = {
    courseUserIsLearning: null
  }

  ifCanEdit = () =>
    this.props.currentUser.id === this.props.course.userId

  // because only active are returned
  ifCanLearnAndReview = () =>
    this.props.courseUserIsLearning

  renderActions = (course) =>
    <section className="actions">
      {
        this.ifCanEdit() &&
        <Link className="edit" to={`/courses/${course.id}/edit`}>
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

  render = () =>
    <div className="course">
      {this.renderActions(this.props.course)}

      <section className="main">
        <h3 className="title">{this.props.course.title}</h3>

        {
          this.ifCanLearnAndReview() &&
          <ReviewAndLearn courseId={this.props.course.id} amountOfProblemsToReview={this.props.amountOfProblemsToReview} amountOfProblemsToLearn={this.props.amountOfProblemsToLearn}/>
        }
      </section>

      <section className="total-amount-of-mems">
        {this.props.amountOfProblems} mems
      </section>
    </div>
}

import { connect } from 'react-redux';
Course = connect(
  (state) => ({
    currentUser: state.global.Authentication.currentUser
  }),
  () => ({})
)(Course);

export { Course };
