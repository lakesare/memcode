import ReactQuill from 'react-quill';

function answerHandler() {
  const range = this.quill.getSelection();
  if (range) {
    this.quill.formatText(
      range.index, range.length, // from start to end of selection
      "answer",
      !this.quill.getFormat(range).answer
    );
  }
}

class Page_test extends React.Component {
  state = { html: 'I know what you mean' }

  render = () =>
    <div className="container">
      <ReactQuill
        value={this.state.html}
        onChange={(html) => this.setState({ html })}

        modules={{
          toolbar: {
            container: ['bold', 'italic', 'answer'],
            handlers: {
              answer: answerHandler
            }
          }
        }}
      />
    </div>
}

export { Page_test };
