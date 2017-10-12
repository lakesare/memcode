class Checkbox extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    idsOfCheckedProblems: PropTypes.array.isRequired,
    updateIdsOfCheckedProblems: PropTypes.func.isRequired
  }

  state = {
    ifHoveringOver: false
  }

  ifChecked = () =>
    this.props.idsOfCheckedProblems.includes(this.props.id)

  uncheck = () =>
    this.props.updateIdsOfCheckedProblems(
      this.props.idsOfCheckedProblems.filter((id) => id !== this.props.id)
    )

  check = () =>
    this.props.updateIdsOfCheckedProblems(
      [...this.props.idsOfCheckedProblems, this.props.id]
    )

  renderIndex = () =>
    <div className="index">
      {this.props.index + 1}
    </div>

  renderMark = () =>
    <div className="mark">
      <i className="fa fa-check-square"/>
    </div>

  renderHovering = () => (
    this.ifChecked() ?
      <div className="-hovering -checked">
        {this.renderMark()}
      </div> :
      <div className="-hovering -not-checked">
        {this.renderMark()}
        {this.renderIndex()}
      </div>
  )

  renderStatic = () => (
    this.ifChecked() ?
      <div className="-static -checked">
        {this.renderMark()}
      </div> :
      <div className="-static -not-checked">
        {this.renderIndex()}
      </div>
  )

  render = () =>
    <section
      className="checkbox"
      onMouseEnter={() => this.setState({ ifHoveringOver: true })}
      onMouseLeave={() => this.setState({ ifHoveringOver: false })}
      onClick={this.ifChecked() ? this.uncheck : this.check}
    >
      {
        this.state.ifHoveringOver ?
          this.renderHovering() :
          this.renderStatic()
      }
    </section>
}

export { Checkbox };
