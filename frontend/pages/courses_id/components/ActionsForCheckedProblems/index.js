import * as ProblemApi from '~/api/Problem';

import posed from 'react-pose';
import Loading from '~/components/Loading';
import { ChooseCourseToMoveProblemsTo } from './components/ChooseCourseToMoveProblemsTo';
import { ButtonToDeleteProblems } from './components/ButtonToDeleteProblems';

import closeButtonSvg from '~/images/closeButton.svg';

import css from './index.css';

const Animation = posed.section({
  hidden: {
    height: 0
  },
  visible: {
    height: 'auto'
  }
});

class ActionsForCheckedProblems extends React.Component {
  static propTypes = {
    // courseId: PropTypes.number.isRequired,
    idsOfCheckedProblems: PropTypes.array.isRequired,
    updateIdsOfCheckedProblems: PropTypes.func.isRequired,
    uiRemoveOldProblems: PropTypes.func.isRequired,
    isSticky: PropTypes.bool.isRequired
  }

  apiDeleteAllCheckedProblems = () => {
    const ids = this.props.idsOfCheckedProblems;
    this.props.uiRemoveOldProblems(ids);
    ProblemApi.deleteMany(false, ids);
  }

  apiMoveAllCheckedProblemsToCourse = (courseId) => {
    const ids = this.props.idsOfCheckedProblems;
    this.props.uiRemoveOldProblems(ids);
    ProblemApi.moveToCourseMany(false, ids, courseId);
  }

  uiClose = () =>
    this.props.updateIdsOfCheckedProblems([])

  render = () => (
    <Animation
      className={css['actions-for-checked-problems'] + ' ' + (this.props.isSticky ? '-sticky' : '-not-sticky') + ' ' + (this.props.idsOfCheckedProblems.length > 0 ? '-visible' : '-not-visible')}
      pose={this.props.idsOfCheckedProblems.length > 0 ? 'visible' : 'hidden'}
    >
      <div className="container">
        <ChooseCourseToMoveProblemsTo apiMoveAllCheckedProblemsToCourse={this.apiMoveAllCheckedProblemsToCourse} amount={this.props.idsOfCheckedProblems.length}/>
        <ButtonToDeleteProblems apiDeleteAllCheckedProblems={this.apiDeleteAllCheckedProblems} amount={this.props.idsOfCheckedProblems.length}/>
        <button
          type="button"
          className="close-button"
          onClick={this.uiClose}
        >
          <img src={closeButtonSvg} alt="Unselect selected flashcards"/>
        </button>
      </div>
    </Animation>
  )
}

export default ActionsForCheckedProblems;
