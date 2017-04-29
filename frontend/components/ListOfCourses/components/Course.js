import React from 'react';

import { Link } from 'react-router';
import { ReviewAndLearn } from './ReviewAndLearn';

import { stripTags } from '~/services/stripTags';

class Course extends React.Component {
  static propTypes = {
    course: React.PropTypes.object.isRequired,
    currentUser: React.PropTypes.object.isRequired,

    amountOfProblemsToLearn: React.PropTypes.number.isRequired,
    amountOfProblemsToReview: React.PropTypes.number.isRequired,
    amountOfProblems: React.PropTypes.number.isRequired,
    courseUserIsLearning: React.PropTypes.object,
    nextDueDateIn: React.PropTypes.object
  }

  static defaultProps = {
    courseUserIsLearning: null,
    nextDueDateIn: null // because courseUserIsLearning can be null
  }

  ifCanEdit = () =>
    this.props.currentUser.id === this.props.course.userId

  ifCanLearnAndReview = () =>
    this.props.courseUserIsLearning &&
    this.props.courseUserIsLearning.active === true

  renderActions = (course) =>
    <section className="actions">
      {
        this.ifCanEdit() &&
        <Link className="action -edit" to={`/courses/${course.id}/edit`}>
          <i className="fa fa-pencil-square-o"/>
        </Link>
      }

      <Link
        className="action -view"
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

        <article className="description">{stripTags(this.props.course.description)}</article>

        {
          this.ifCanLearnAndReview() &&
          <ReviewAndLearn
            courseId={this.props.course.id}
            amountOfProblemsToReview={this.props.amountOfProblemsToReview}
            amountOfProblemsToLearn={this.props.amountOfProblemsToLearn}
            nextDueDateIn={this.props.nextDueDateIn}
          />
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
