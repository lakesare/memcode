import React from 'react';
import Main from '~/appComponents/Main';
import SignInButtons from '~/appComponents/SignInButtons';

import css from './index.css';

class Page_pleaseSignIn extends React.Component {
  render = () =>
    <Main className={css.main}>
      <div className="container">
        <div className="space"/>
        <article>
          <h2>Sign In</h2>
          <p>
            Sign in with your github/google account, and get access to creating your own courses, and learning and reviewing flashcards.
          </p>

          <SignInButtons/>
        </article>
      </div>
    </Main>
}

export default Page_pleaseSignIn;
