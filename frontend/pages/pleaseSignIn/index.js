import React from 'react';
import { Header } from '~/components/Header';
import css from './index.css';

class Page_pleaseSignIn extends React.Component {
  render = () =>
    <main className={css.main}>
      <Header/>

      <div className="container">
        <div className="space"/>
        <article>
          <h2>Consider signing in.</h2>
          <p>
            Sign in with your github account, and get access to creating your own courses, learning and reviewing mems and so on.
          </p>
          <a className="sign-in button -black" href="https://github.com/login/oauth/authorize?client_id=1d94a714bab1f1576872">
            Sign in <i className="fa fa-github"/>
          </a>
        </article>
      </div>
    </main>
}

export { Page_pleaseSignIn };
