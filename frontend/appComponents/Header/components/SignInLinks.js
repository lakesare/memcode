class SignInLinks extends React.Component {
  /*Before clicking on the login button, I am trying to get the current path name
  with the help of the below function working_path()*/
  working_path = () =>{
    return(redirect_back_to = "/courses")//window.location.pathname
    /* Just for testing I have set to "courses" instead of window.location.pathname*/
  }

  render = () =>
    <section className="sign-in-links">
      <label className="soliciting">Sign in:</label>
      <div className="links">
        <a className="gmail" href={window.env.googleSignInLink}>
          <span className="name">Gmail</span>
          <i className="fa fa-google"/>
        </a>
        <a className="github" href={window.env.githubSignInLink}>
          <span className="name">Github</span>
          <i className="fa fa-github"/>
        </a>
      </div>
    </section>
}

export { SignInLinks };
