import { SlateEditor } from '~/components/SlateEditor';

// user sees the question,
// types in answer in the decorative lower editor on the right,
// then clicks to check the answer
// then answer rating is given
// then 'NEXT'

// separateAnswer:
//   look at the problem, think of an answer
//   click on the answer
//   give self rating
class ProblemWithSeparateAnswer extends React.Component {
  static propTypes = {
    mode: PropTypes.string.isRequired,

    problemContent: PropTypes.object.isRequired,
    updateProblemContent: PropTypes.func.isRequired,

    statusOfSolving: PropTypes.oneOf([
      'solving', 'seeingAnswer'
    ]), // when 'solving'
  }

  updateProblemContent = (editorName, newEditorState) =>
    this.props.updateProblemContent({
      ...this.props.problemContent,
      [editorName]: newEditorState
    })

  render = () =>
    <section className="problem -withSeparateAnswer">
      <div className="first-column">
        <SlateEditor
          editorState={this.props.problemContent.content}
          updateEditorState={newState => this.updateProblemContent('content', newState)}
          placeholder={<h1>Hello</h1>}
        />
      </div>

      <div className="second-column">
        <SlateEditor
          editorState={this.props.problemContent.answer}
          updateEditorState={newState => this.updateProblemContent('answer', newState)}
          placeholder={<h1>Answer</h1>}
        />
      </div>
    </section>
}

const mapStateToProps = (state, ownProps) => {
  if (ownProps.mode === 'solving') {
    const pageState = state.pages.Page_courses_id_review;
    return {
      statusOfSolving: pageState.statusOfSolving.status
    };
  } else {
    return {};
  }
};
import { Page_courses_id_review_Actions } from '~/pages/courses_id_review/reducer';
const { enterPressed } = Page_courses_id_review_Actions;
const mapDispatchToProps = (dispatch) => ({
  enterPressed: () => dispatch(enterPressed())
});

import { connect } from 'react-redux';
ProblemWithSeparateAnswer = connect(mapStateToProps, mapDispatchToProps)(ProblemWithSeparateAnswer);

export { ProblemWithSeparateAnswer };
