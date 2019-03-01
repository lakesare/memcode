import React from 'react';
import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';

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
            Sign in with your github/google account, and get access to creating your own courses, and learning and reviewing flashcards.
          </p>

          <section className="buttons">
            <a className="sign-in button -gmail" href={window.env.googleSignInLink}>
              with gmail <i className="fa fa-google"/>
            </a>
            <a className="sign-in button -github" href={window.env.githubSignInLink}>
              with github <i className="fa fa-github"/>
            </a>
          </section>
        </article>
      </div>

      <Footer/>
    </main>
}

export default Page_pleaseSignIn;
