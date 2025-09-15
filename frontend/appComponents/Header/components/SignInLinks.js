import TogglerAndModal from '~/components/TogglerAndModal';
import SignInButtons from '~/appComponents/SignInButtons';

class SignInLinks extends React.Component {
  render = () =>
    <TogglerAndModal className="sign-in-modal" toggler={<button className="button sign-in">Sign In</button>}>{() =>
      <div className="standard-modal standard-modal--sm">
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Sign In</h2>
        </div>
        <div className="standard-modal__main">
          <SignInButtons text="Sign in with"/>
        </div>
      </div>
    }</TogglerAndModal>
}

export { SignInLinks };
