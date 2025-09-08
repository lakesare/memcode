import orFalse from '~/services/orFalse';
import api from '~/api';

import { withRouter, Link } from 'react-router-dom';
import disableOnSpeRequest from '~/services/disableOnSpeRequest';
import StandardTooltip from '~/components/StandardTooltip';
import TogglerAndModal from '~/components/TogglerAndModal';
import InviteCoauthorModal from './InviteCoauthorModal';

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
    author: PropTypes.object,
    coauthors: PropTypes.array,

    apiStartLearning: PropTypes.func.isRequired,
    apiStopLearning: PropTypes.func.isRequired,
    apiResumeLearning: PropTypes.func.isRequired,
    MyActions: PropTypes.object.isRequired,
    My: PropTypes.object.isRequired,
    currentProblem: PropTypes.object,
    type: PropTypes.string.isRequired,
    canIEditCourse: PropTypes.bool,
    onProblemsImported: PropTypes.func
  }

  state = {
    speDuplicate: {},
  }

  constructor(props) {
    super(props);
    this.tippyInstance = null;
  }

  closeDropdown = () => {
    if (this.tippyInstance) {
      this.tippyInstance.hide();
    }
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
        this.ifCourseIsLearnedAndActive() &&
        <li>
          <button
            type="button"
            onClick={() => {
              this.props.My.pinnedCourseIds.includes(this.props.courseDto.course.id) ?
                this.props.MyActions.removePinnedCourse(this.props.courseDto.course.id) :
                this.props.MyActions.addPinnedCourse(this.props.courseDto.course.id);
              this.closeDropdown();
            }}
            style={{ color: 'rgb(247, 54, 54)' }}
          >
            <div className="text">
              {
                this.props.My.pinnedCourseIds.includes(this.props.courseDto.course.id) ?
                  'Unpin' : 'Pin'
              }
            </div>
            <div className="comment -white">
              Pin your course to see it in the header.
            </div>
          </button>
        </li>
      }

      {
        this.props.courseDto.amountOfProblems > 0 && !this.ifCourseIsLearnedAndActive() &&
        <li>
          <Link
            to={`/courses/${this.props.courseDto.course.id}/review/simulated`}
            style={{ color: 'rgb(236, 236, 133)' }}
            onClick={this.closeDropdown}
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
            onClick={this.closeDropdown}
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
            onClick={this.closeDropdown}
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
          <Link
            to={`/courses/${this.props.courseDto.course.id}/all/print`}
            target="_blank"
            style={{ color: 'rgb(219, 219, 216)' }}
            onClick={this.closeDropdown}
          >
            <div className="text">Print All Out</div>
            <div className="comment -white">
              Open a page suitable for printing all cards within this deck.
            </div>
          </Link>
        </li>
      }

      {
        this.ifCourseIsLearnedAndActive() &&
        <li>
          <button
            type="button"
            onClick={() => {
              this.props.apiStopLearning();
              this.closeDropdown();
            }}
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
            onClick={() => {
              this.apiDuplicateCourse();
              this.closeDropdown();
            }}
            style={{ color: 'rgb(120, 175, 244)', ...disableOnSpeRequest(this.state.speDuplicate) }}
          >
            <div className="text">Duplicate</div>
            <div className="comment -white">
              Create own course with flashcards from this course.
            </div>
          </button>
        </li>
      }

      <li>
        <TogglerAndModal
          toggler={
            <button
              type="button"
              style={{ color: 'rgb(232, 141, 230)' }}
              onClick={this.closeDropdown}
            >
              <div className="text">
                Embed
              </div>
              <div className="comment -white">
                Embed the flashcards from this course into an iframe (useful if you use genial.ly)
              </div>
            </button>
          }
        >
          {this.renderModal()}
        </TogglerAndModal>
      </li>

      {
        this.props.canIEditCourse && this.props.author && this.props.coauthors &&
        <li>
          <InviteCoauthorModal
            course={this.props.courseDto.course}
            author={this.props.author}
            coauthors={this.props.coauthors}
            currentUser={this.props.currentUser}
            toggler={
              <button
                type="button"
                style={{ color: 'rgb(120, 175, 244)' }}
                onClick={this.closeDropdown}
              >
                <div className="text">Invite Coauthors</div>
                <div className="comment -white">
                  Add another Memcode user as a coauthor, learning together with someone special is more fun!
                </div>
              </button>
            }
          />
        </li>
      }

      {
        this.props.currentProblem &&
        <li>
          <button
            type="button"
            onClick={() => {
              this.props.MyActions.ignoreProblem(this.props.courseDto.course.id, this.props.currentProblem.id);
              this.props.ignoreCurrentFlashcard();
              api.ProblemUserIsLearningApi.ignoreAlreadyLearnedProblem(() => {}, { problemId: this.props.currentProblem.id, cuilId: this.props.courseDto.courseUserIsLearning.id });
              this.closeDropdown();
            }}
            style={{ color: 'rgb(120, 175, 244)' }}
          >
            <div className="text">Ignore</div>
            <div className="comment -white">
              Ignore this flashcard
            </div>
          </button>
        </li>
      }
    </ul>

  renderModal = () =>
    <section className={"standard-modal standard-modal--md "}>
      <div className="standard-modal__header">
        <h2 className="standard-modal__title">Embed this course</h2>
      </div>

      <div className="standard-modal__main">
        <p>
          {`<iframe src="https://www.memcode.com/courses/${this.props.courseDto.course.id}/review/simulated?embed=true" scrolling="yes" style="width: 100%; height: 100%;"></iframe>`}
        </p>
      </div>
    </section>

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
              trigger: 'click',
              onCreate: (instance) => {
                this.tippyInstance = instance;
              }
            }}
          >
            <button type="button" className="button more-button">
              <i className="material-icons">more_vert</i>
            </button>
          </StandardTooltip>
        </div>
      </div> :
      <div className="buttons">
        <div className="learn-and-review-buttons">
          <Link
            to={`/courses/${this.props.courseDto.course.id}/review/simulated`}
            className="button -to-learn"
          >TEST DRIVE ({this.props.courseDto.amountOfProblems})</Link>
        </div>
      </div>
}

export default CuilButtons;
