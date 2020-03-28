class ButtonToDeleteProblems extends React.Component {
  static propTypes = {
    apiDeleteAllCheckedProblems: PropTypes.func.isRequired,
    amount: PropTypes.number.isRequired
  }

  render = () =>
    <button
      type="button"
      className="delete-button button"
      onClick={this.props.apiDeleteAllCheckedProblems}
    >
      {`Delete (${this.props.amount === 0 ? 1 : this.props.amount})`}
    </button>
}

export { ButtonToDeleteProblems };
