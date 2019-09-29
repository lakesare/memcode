import css from './index.css';

class Page_pleaseSignIn extends React.Component {
  static propTypes = {
    text: PropTypes.string
  }

  static defaultProps = {
    text: 'With'
  }

  render = () =>
    <div className={`sign-in-buttons ${css.local}`}>
      <a className="sign-in button -move-up-on-hover -gmail" href={window.env.googleSignInLink}>
        {this.props.text} gmail <i className="fa fa-google"/>
      </a>
      <a className="sign-in button -move-up-on-hover -github" href={window.env.githubSignInLink}>
        {this.props.text} github <i className="fa fa-github"/>
      </a>
    </div>
}

export default Page_pleaseSignIn;
