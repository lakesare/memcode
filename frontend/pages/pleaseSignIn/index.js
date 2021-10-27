import React from 'react';
import Main from '~/appComponents/Main';
import SignInButtons from '~/appComponents/SignInButtons';

import css from './index.css';

class Page_pleaseSignIn extends React.Component {
  render = () =>
    <Main className={css.main}>
      <div className="container">
        <div className="space"/>
        <div className="standard-title-and-description">
          <h2 className="title">Sign In</h2>
          <article className="description">
            Sign in with your github/google account, and get access to creating your own courses, learning and reviewing flashcards.
          </article>
        </div>

        <SignInButtons/>
      </div>
    </Main>
}

export default Page_pleaseSignIn;
