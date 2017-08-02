
class FakeProblemWithSeparateAnswer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'solving'
    };
  }

  render = () =>
    <section className="problem -withSeparateAnswer">
      <div className="first-column">
        How would you interpolate a string in ES6?
      </div>
      <div className="second-column">
        {
          this.state.mode === 'solving' ?
            <div
              className="see-answer button"
              onClick={() => this.setState({ mode: 'seeingAnswer' })}
            >See answer</div> :
            <div className="answer">
              <pre>
                <code>`Hello, ${"{name}"}`</code>
              </pre>
            </div>
        }
      </div>
    </section>
}

export { FakeProblemWithSeparateAnswer };
