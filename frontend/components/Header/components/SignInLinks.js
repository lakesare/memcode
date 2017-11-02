class SignInLinks extends React.Component {
  render = () =>
    <section className="sign-in-links">
      <h6 className="soliciting">Sign in:</h6>
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
