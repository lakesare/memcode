import css from './index.css';
import { withRouter } from 'react-router-dom';

@withRouter

class Page_pleaseSignIn extends React.Component {
    
  redirectBackTo = () => {
    sessionStorage.setItem("lastpage","/courses/new");
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
        {this.props.text} gmail <i className="fa fa-google"/>
      </a>
      <a className="sign-in button -move-up-on-hover -github" onClick={this.redirectBackTo} href={window.env.githubSignInLink}>
        {this.props.text} github <i className="fa fa-github"/>
      </a>
    </div>
}

export default Page_pleaseSignIn;
