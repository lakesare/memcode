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
    <button
      className={`delete-button button -purple-o ${this.state.ifAskingForApproval ? '-approving' : ''}`}
      onClick={this.state.ifAskingForApproval ? this.props.apiDeleteAllCheckedProblems : this.uiAskForApproval}
    >
      {
        this.state.ifAskingForApproval ?
          `Delete ${this.props.amount} flashcards?` :
          `Delete (${this.props.amount})`
      }
    </button>
}

export { ButtonToDeleteProblems };
