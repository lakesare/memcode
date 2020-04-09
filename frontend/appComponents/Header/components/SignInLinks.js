import { withRouter } from 'react-router-dom';

@withRouter

class SignInLinks extends React.Component {

  redirectBackTo = () => {
    sessionStorage.setItem("lastpage",this.props.location.pathname);
    
  }
  render = () => 
    <section className="sign-in-links">
      <label className="soliciting">Sign in:</label>
      <div className="links">
        <a className="gmail" onClick ={this.redirectBackTo} href={window.env.googleSignInLink}>
          <span className="name">Gmail</span>
          <i className="fa fa-google"/>
        </a>
        <a className="github" onClick ={this.redirectBackTo} href={window.env.githubSignInLink}>
          
          <span className="name">Github</span>
          <i className="fa fa-github"/>
        </a>
      </div>
    </section>
}

export {SignInLinks};
