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

    nOfProblemsToLearn: PropTypes.number.isRequired,
    nOfProblemsToReview: PropTypes.number.isRequired,
    courseDto: PropTypes.shape({
      course: PropTypes.object.isRequired,
      amountOfProblems: PropTypes.number.isRequired,
      courseUserIsLearning: PropTypes.object
    }).isRequired,

    apiStartLearning: PropTypes.func.isRequired,
    apiStopLearning: PropTypes.func.isRequired,
    apiResumeLearning: PropTypes.func.isRequired,
    MyActions: PropTypes.object.isRequired,
    My: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired
  }

  state = {
    speDuplicate: {}
  }

  renderStartLearningButton = () =>
    <button className="button -orange start-learning-button" type="button" onClick={this.props.apiStartLearning}>
      Start Learning
    </button>

  renderResumeLearningButton = () =>
    <button className="button -orange resume-learning-button" type="button" onClick={this.props.apiResumeLearning}>
      Resume Learning
    </button>

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
    // this.props.My.speCourses.status === 'request'
    const cuil = this.props.courseDto.courseUserIsLearning;
    return cuil && cuil.active;
  }

  renderLearnButton = () =>
    <Link
      to={`/courses/${this.props.courseDto.course.id}/learn`}
      className="button -to-learn"
    >LEARN ({this.props.nOfProblemsToLearn})</Link>

  // You have ${this.props.nOfProblemsToReview} flashcards to repeat! Click here, and try to recall the answers to your flashcards.
  renderReviewButton = () =>
    <Link
      to={`/courses/${this.props.courseDto.course.id}/review`}
      className="button -to-review"
    >REVIEW ({this.props.nOfProblemsToReview})</Link>

  renderDropdown = () =>
    <ul className="standard-tooltip-dropdown">
      {
        this.props.courseDto.amountOfProblems > 0 && !this.ifCourseIsLearnedAndActive() &&
        <li>
          <Link
            to={`/courses/${this.props.courseDto.course.id}/review/simulated`}
            style={{ color: 'rgb(236, 236, 133)' }}
          >
            <div className="text">Test Drive</div>
            <div className="comment -white">
              Review all flashcards of this course (results won't be recorded).
            </div>
          </Link>
        </li>
      }

      {
        this.props.courseDto.amountOfProblems > 0 && this.ifCourseIsLearnedAndActive() &&
        <li>
          <Link
            to={`/courses/${this.props.courseDto.course.id}/review/persistent`}
            style={{ color: 'rgb(236, 236, 133)' }}
          >
            <div className="text">Review All</div>
            <div className="comment -white">
              Review all the flashcards you learned without waiting for their due time.
            </div>
          </Link>
        </li>
      }

      {
        this.ifCourseIsLearnedAndActive() &&
        <li>
          <Link
            to={`/courses/${this.props.courseDto.course.id}/review/print`}
            target="_blank"
            style={{ color: 'rgb(219, 219, 216)' }}
          >
            <div className="text">Print Out</div>
            <div className="comment -white">
              Open a page suitable for printing out the flashcards ready for the review.
            </div>
          </Link>
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
            <div className="text">Stop Learning</div>
            <div className="comment -white">
              You won't be asked to review flashcards from this course again.
            </div>
          </button>
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
            <div className="text">Duplicate</div>
            <div className="comment -white">
              Create own course with flashcards from this course.
            </div>
          </button>
        </li>
      }

      {
        this.props.type === 'editOrShow' &&
        <li>
          <button
            type="button"
            onClick={this.props.MyActions.switchFlashcardOrder}
            style={{ color: 'rgb(120, 175, 244)' }}
          >
            <div className="text">
              {this.props.My.flashcardOrder ? 'Oldest First' : 'Newest First'}
            </div>
            <div className="comment -white">
              Switch the order of flashcards.
            </div>
          </button>
        </li>
      }

      <li>
        <button
          type="button"
          onClick={this.props.MyActions.switchIfShowDraft}
          style={{ color: 'rgb(181, 184, 239)' }}
        >
          <div className="text">
            {this.props.My.ifShowDraft ? 'Hide Draft' : 'Show Draft'}
          </div>
          <div className="comment -white">
            Whether to show the draft text area for Question+Answer flashcards.
          </div>
        </button>
      </li>
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
            this.props.nOfProblemsToLearn > 0 &&
            this.renderLearnButton()
          }

          {
            this.props.courseDto.courseUserIsLearning &&
            this.props.nOfProblemsToReview > 0 &&
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
            <button type="button" className="button more-button">
              <i className="material-icons">more_vert</i>
            </button>
          </StandardTooltip>
        </div>
      </div> :
      <div className="buttons">
        <div className="please-sign-in_and_simulated-review-button">
          <label className="please-sign-in">Sign in to start recording results</label>

          <Link
            to={`/courses/${this.props.courseDto.course.id}/review/simulated`}
            className="button simulated-review-button"
          >TEST DRIVE ({this.props.courseDto.amountOfProblems})</Link>
        </div>
      </div>
}

export default CuilButtons;
