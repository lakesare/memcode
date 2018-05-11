import onClickOutside from 'react-onclickoutside';

@onClickOutside
class ButtonToDeleteProblems extends React.Component {
  static propTypes = {
    apiDeleteAllCheckedProblems: PropTypes.func.isRequired,
    amount: PropTypes.number.isRequired
  }

  state = {
    ifAskingForApproval: false
  }

  handleClickOutside = () =>
    this.setState({ ifAskingForApproval: false })

  uiAskForApproval = () =>
    this.setState({ ifAskingForApproval: true })

  render = () =>
    <button className={`delete-button button -black ${this.state.ifAskingForApproval ? '-approving' : ''}`} onClick={this.uiAskForApproval}>
      {
        this.state.ifAskingForApproval ?
          <div onClick={this.props.apiDeleteAllCheckedProblems}>
            Delete {this.props.amount} flashcards?
          </div> :
          <div>Delete ({this.props.amount})</div>
      }
    </button>
}

export { ButtonToDeleteProblems };
