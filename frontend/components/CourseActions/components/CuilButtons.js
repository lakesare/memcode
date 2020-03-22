import orFalse from '~/services/orFalse';
import api from '~/api';

import { withRouter, Link } from 'react-router-dom';
import disableOnSpeRequest from '~/services/disableOnSpeRequest';
import StandardTooltip from '~/components/StandardTooltip';

@withRouter
class CuilButtons extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired,

    amountOfProblems: orFalse(PropTypes.object).isRequired,
    courseDto: PropTypes.shape({
      course: PropTypes.object.isRequired,
      amountOfProblems: PropTypes.number.isRequired,
      courseUserIsLearning: PropTypes.object
    }).isRequired,

    apiStartLearning: PropTypes.func.isRequired,
    apiStopLearning: PropTypes.func.isRequired,
    apiResumeLearning: PropTypes.func.isRequired,
    MyActions: PropTypes.object.isRequired
  }

  state = {
    speDuplicate: {}
  }

  getTooltipProps = () => ({
    tooltipProps: {
      delay: 1000,
      animation: 'fade',
      duration: 600
    }
  })

  renderStartLearningButton = () =>
    <StandardTooltip {...this.getTooltipProps()} tooltipEl="We will be recording your results, and asking you to repeat flashcards when necessary!">
      <button className="button -purple start-learning-button" type="button" onClick={this.props.apiStartLearning}>
        <i className="fa fa-plus"/> TO LEARNED COURSES
      </button>
    </StandardTooltip>

  renderResumeLearningButton = () =>
    <StandardTooltip {...this.getTooltipProps()} tooltipEl="All of your results are saved! Just click resume and return to learning a course.">
      <button className="button -purple resume-learning-button" type="button" onClick={this.props.apiResumeLearning}>
        RESUME LEARNING
      </button>
    </StandardTooltip>

  apiDuplicateCourse = () =>
    api.CourseApi.duplicate(
      (spe) => this.setState({ speDuplicate: spe }),
      { courseId: this.props.courseDto.course.id }
    )
      .then((payload) => {
        // stuff needs to be refetched, as history.push() doesn't trigger a rerender
        this.props.MyActions.apiGetCourses();
        this.props.history.push(`/courses/${payload.courseId}`);
      })

  ifCourseIsLearnedAndActive = () => {
    const cuil = this.props.courseDto.courseUserIsLearning;
    return cuil && cuil.active;
  }

  renderLearnButton = () =>
    <Link
      to={`/courses/${this.props.courseDto.course.id}/learn`}
      className="button -to-learn"
    >LEARN ({this.props.amountOfProblems.toLearn})</Link>

  // You have ${this.props.amountOfProblems.toReview} flashcards to repeat! Click here, and try to recall the answers to your flashcards.
  renderReviewButton = () =>
    <Link
      to={`/courses/${this.props.courseDto.course.id}/review`}
      className="button -to-review"
    >REVIEW ({this.props.amountOfProblems.toReview})</Link>

  renderDropdown = () =>
    <ul className="standard-tooltip-dropdown">
      {
        this.props.courseDto.amountOfProblems > 0 &&
        <li>
          <Link
            to={`/courses/${this.props.courseDto.course.id}/review/simulated`}
            style={{ color: 'rgb(236, 236, 133)' }}
          >
            Test Drive
          </Link>
          <div className="comment -white">
            Review all flashcards of this course without your results being recorded.
          </div>
        </li>
      }

      {
        this.ifCourseIsLearnedAndActive() &&
        <li>
          <button
            type="button"
            onClick={this.props.apiStopLearning}
            style={{ color: 'rgb(252, 126, 126)' }}
          >
            Stop Learning
          </button>
          <div className="comment -white">
            You won't be asked to review flashcards from this course again.
          </div>
        </li>
      }

      {
        this.props.courseDto.course.userId !== this.props.currentUser.id &&
        <li>
          <button
            type="button"
            onClick={this.apiDuplicateCourse}
            style={{ color: 'rgb(120, 175, 244)', ...disableOnSpeRequest(this.state.speDuplicate) }}
          >
            Duplicate
          </button>
          <div className="comment -white">
            Create own course with flashcards from this course.
          </div>
        </li>
      }
    </ul>

  render = () =>
    this.props.currentUser ?
      <div className="buttons">
        <section className="start-stop-or-resume-learning-course">
          {
            !this.props.courseDto.courseUserIsLearning &&
            this.renderStartLearningButton()
          }
          {
            this.props.courseDto.courseUserIsLearning && !this.props.courseDto.courseUserIsLearning.active &&
            this.renderResumeLearningButton()
          }
        </section>

        <div className="learn-and-review-buttons">
          {
            this.props.courseDto.courseUserIsLearning &&
            this.props.amountOfProblems.toLearn > 0 &&
            this.renderLearnButton()
          }

          {
            this.props.courseDto.courseUserIsLearning &&
            this.props.amountOfProblems.toReview > 0 &&
            this.renderReviewButton()
          }

          <StandardTooltip
            tooltipEl={this.renderDropdown()}
            tooltipProps={{
              interactive: true,
              placement: 'bottom-end',
              trigger: 'click'
            }}
          >
            <button type="button" className="more-button">
              <i className="material-icons">more_vert</i>
            </button>
          </StandardTooltip>
        </div>
      </div> :
      <div className="please-sign-in_and_simulated-review-button">
        <label className="please-sign-in">Sign in to start recording results</label>

        <Link
          to={`/courses/${this.props.courseDto.course.id}/review/simulated`}
          className="button simulated-review-button"
        >TEST DRIVE ({this.props.courseDto.amountOfProblems})</Link>
      </div>
}

export default CuilButtons;
