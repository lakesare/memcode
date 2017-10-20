import requestIcon from '~/components/Loading/requestIcon.svg';

class Checkbox extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    idsOfCheckedProblems: PropTypes.array.isRequired,
    updateIdsOfCheckedProblems: PropTypes.func.isRequired,
    speSave: PropTypes.object.isRequired
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
      <div className="index-and-mark -hovering -checked">
        {this.renderMark()}
      </div> :
      <div className="index-and-mark -hovering -not-checked">
        {this.renderMark()}
        {this.renderIndex()}
      </div>
  )

  renderStatic = () => (
    this.ifChecked() ?
      <div className="index-and-mark -static -checked">
        {this.renderMark()}
      </div> :
      <div className="index-and-mark -static -not-checked">
        {this.renderIndex()}
      </div>
  )

  render = () => (
    this.props.speSave.status === 'request' ?
      <section className="loading-checkbox">
        <img src={`/${requestIcon}`}/>
      </section> :
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
  )
}

export { Checkbox };
