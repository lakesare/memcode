import * as ProblemApi from '~/api/Problem';

import { Loading } from '~/components/Loading';
import { ChooseCourseToMoveProblemsTo } from './components/ChooseCourseToMoveProblemsTo';
import { ButtonToDeleteProblems } from './components/ButtonToDeleteProblems';

import closeButtonSvg from '~/images/closeButton.svg';

import css from './index.css';

import posed from 'react-pose';

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

  state = { speRemovingProblems: { status: 'success' } }

  onRemove = (spe) => this.setState({ speRemovingProblems: spe })

  apiDeleteAllCheckedProblems = () =>
    ProblemApi.deleteMany(this.onRemove, this.props.idsOfCheckedProblems)
      .then(() => this.props.uiRemoveOldProblems(this.props.idsOfCheckedProblems))

  apiMoveAllCheckedProblemsToCourse = (courseId) =>
    ProblemApi.moveToCourseMany(this.onRemove, this.props.idsOfCheckedProblems, courseId)
      .then(() => this.props.uiRemoveOldProblems(this.props.idsOfCheckedProblems))

  uiClose = () =>
    this.props.updateIdsOfCheckedProblems([])

  render = () => (
    <Animation className={css['actions-for-checked-problems'] + ' ' + (this.props.isSticky ? '-sticky' : '-not-sticky')} pose={this.props.idsOfCheckedProblems.length > 0 ? 'visible' : 'hidden'}>
      <Loading spe={this.state.speRemovingProblems}>
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
      </Loading>
    </Animation>
  )
}

export default ActionsForCheckedProblems;
