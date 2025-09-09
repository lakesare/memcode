import css from './index.scss';
import { withRouter } from 'react-router-dom';
import AuthModal from '~/appComponents/AuthModal';

@withRouter

class Page_pleaseSignIn extends React.Component {
    
  redirectBackTo = () => {
    // Store current page for redirect after sign-in
    sessionStorage.setItem("lastpage", window.location.pathname);
  }

  static propTypes = {
    text: PropTypes.string
  }

  static defaultProps = {
    text: 'With'
  }

  render = () =>
    <div className={`sign-in-buttons ${css.local}`}>
      <a className="sign-in button -move-up-on-hover -gmail" onClick={this.redirectBackTo} href={window.env.googleSignInLink}>
        {this.props.text} google <i className="fa fa-google"/>
      </a>
      <a className="sign-in button -move-up-on-hover -github" onClick={this.redirectBackTo} href={window.env.githubSignInLink}>
        {this.props.text} github <i className="fa fa-github"/>
      </a>
      <AuthModal
        toggler={
          <a className="sign-in button -move-up-on-hover -username">
            {this.props.text} email <i className="fa fa-user"/>
          </a>
        }
      />
    </div>
}

export default Page_pleaseSignIn;
