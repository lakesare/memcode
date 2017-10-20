import { Gateway } from 'react-gateway';

// works with 'Function As Component Child' (example: https://gist.github.com/choonkending/7da9fd006df752680ad51f58440bbc40)
// ___how to use it?
// <TogglerAndModal toggler={<a>Add User</a>}>{closeModal =>
//   <SomeComponent
//     title="New User"
//     closeModal={closeModal}
//  />
// }</TogglerAndModal>
// ___gotchas?
// you have to have <GatewayProvider/> somewhere as parent, refer to 'react-gateway' docs.
// this is done in order to keep it a direct child of <main/>.
class TogglerAndModal extends React.Component {
  static propTypes = {
    // notice that toggler must be an element that can have children (not a void one)
    // (because we are keeping the modal in it in order to avoid creating exsessive wrapping elements)
    toggler: PropTypes.element.isRequired,
    children: PropTypes.any.isRequired,
    afterModalOpens: PropTypes.func,
    afterModalCloses: PropTypes.func,
    modalClassName: PropTypes.string
  }

  static defaultProps = {
    afterModalOpens: () => {},
    afterModalCloses: () => {},
    modalClassName: ''
  }

  state = {
    ifModalIsOpen: false
  }

  openModal = () => {
    this.setState({ ifModalIsOpen: true });
    this.props.afterModalOpens();
  }
  closeModal = () => {
    this.setState({ ifModalIsOpen: false });
    this.props.afterModalCloses();
  }

  renderCloseButton = () =>
    <button type="button" className="close-button" onClick={this.closeModal}>
      +
    </button>

  renderModal = () =>
    this.state.ifModalIsOpen &&
    <Gateway key="key-for-array" into="main">
      <div className={`standard-modal ${this.props.modalClassName}`}>
        {this.renderCloseButton()}
        {
          typeof this.props.children === 'function' ?
            this.props.children(this.closeModal) :
            this.props.children
        }
      </div>
    </Gateway>

  render = () =>
    React.cloneElement(
      this.props.toggler,
      {
        onClick: this.openModal,
        style: { cursor: 'pointer' }
      },
      [
        ...React.Children.toArray(this.props.toggler.props.children),
        this.renderModal()
      ]
    )
}

export { TogglerAndModal };
