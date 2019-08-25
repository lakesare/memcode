import _ from 'lodash';

import * as ProblemApi from '~/api/Problem';
import * as speCreator from '~/services/spe';
import { Problem } from '~/components/Problem';
import { Loading } from '~/components/Loading';

const createEmptyEditorState = (type) => {
  switch (type) {
    case 'separateAnswer': {
      return { content: '', answer: '' };
    }
    case 'inlinedAnswers': {
      return { content: '', explanation: '' };
    }
  }
};

class NewProblem extends React.Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
    uiAddOptimisticProblem: PropTypes.func.isRequired,
    uiUpdateOptimisticProblemIntoOld: PropTypes.func.isRequired
  }

  state = {
    speCreateProblem: {},
    currentProblemType: 'separateAnswer',
    problemContent: createEmptyEditorState('separateAnswer')
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.saveOnCTRLS, false);
  }

  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.saveOnCTRLS, false);
  }

  saveOnCTRLS = (event) => {
    // metaKey catches cmd in mac, ctrlKey catches ctrl in ubuntas
    if ((event.ctrlKey || event.metaKey) && event.keyCode === 83) { // CTRL+S
      event.preventDefault();
      this.apiSave();
    }
  }

  uiValidate = () => {
    const type = this.state.currentProblemType;
    const problemContent = this.state.problemContent;
    let error = '';
    const imgIsLoadingError = 'Please wait for the image to upload ❤️';
    const isImgLoading = (text) => text.includes('placeholder-for-loading-image');

    if (type === 'separateAnswer') {
      if (!problemContent.content) {
        error = "Please add the question (you'll be asked it when you review the flashcard).";
      } else if (!problemContent.answer) {
        error = "Please add the answer to the question.";
      } else if (isImgLoading(problemContent.content) || isImgLoading(problemContent.answer)) {
        error = imgIsLoadingError;
      }
    } else if (type === 'inlinedAnswers') {
      if (!problemContent.content) {
        error = "Please add some sentence with a word that you'll need to fill in on review (select words you'd like to fill in, and press Mark As Answer).";
      } else if (isImgLoading(problemContent.content) || isImgLoading(problemContent.explanation)) {
        error = imgIsLoadingError;
      }
    }

    if (error) {
      this.setState({ speCreateProblem: speCreator.failure(error) });
      return false;
    } else {
      return true;
    }
  }

  apiSave = () => {
    if (this.uiValidate()) {
      const optimisticId = _.uniqueId();
      const problemHash = {
        type:     this.state.currentProblemType,
        content:  this.state.problemContent,
        courseId: this.props.courseId
      };
      const optimisticProblem = {
        ...problemHash,
        _optimistic_id: optimisticId
      };
      this.props.uiAddOptimisticProblem(optimisticProblem);
      this.setState({
        problemContent: createEmptyEditorState(this.state.currentProblemType)
      });

      ProblemApi.create(
        (spe) => this.setState({ speCreateProblem: spe }),
        problemHash
      )
        .then((createdProblem) => {
          this.props.uiUpdateOptimisticProblemIntoOld(optimisticId, createdProblem);
        });
    }
  }

  updateProblemContent = (problemContent) =>
    this.setState({ problemContent })

  updateType = (newType) => {
    const oldContent = this.state.problemContent;
    let newContent;

    if (newType === 'separateAnswer') {
      newContent = {
        content: oldContent.content,
        answer: oldContent.explanation
      };
    } else if (newType === 'inlinedAnswers') {
      newContent = {
        content: oldContent.content,
        explanation: oldContent.answer
      };
    }

    this.setState({
      currentProblemType: newType,
      problemContent: newContent
    });
  }

  renderTypeButton = (type, typeInHuman) =>
    <button
      type="button"
      className={`button ${this.state.currentProblemType === type ? '-active' : ''}`}
      onClick={() => this.state.currentProblemType !== type && this.updateType(type)}
    >{typeInHuman}</button>

  render = () =>
    <div className="new-problem">
      <Problem
        mode="edit"
        problemContent={this.state.problemContent}
        updateProblemContent={this.updateProblemContent}
        problemType={this.state.currentProblemType}
      />

      <section className="how-to-create">
        <span>CTRL+S to save a new flashcard</span>
        <button className="button -pink -fade-out-on-hover" onClick={this.apiSave}>SAVE</button>
      </section>

      <Loading enabledStatuses={['failure']} spe={this.state.speCreateProblem}/>

      <section className="choose-type">
        <label>FLASHCARD TYPE</label>
        {this.renderTypeButton('separateAnswer', 'question answer')}
        {this.renderTypeButton('inlinedAnswers', 'fill-in answer')}
      </section>
    </div>
}

export { NewProblem };
