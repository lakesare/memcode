import React from 'react';

import { Header } from '~/components/Header';
import { FakeProblemWithInlinedAnswers } from './components/FakeProblemWithInlinedAnswers';
import { FakeProblemWithSeparateAnswer } from './components/FakeProblemWithSeparateAnswer';
import { Table } from './components/Table';

import { browserHistory } from 'react-router';

import css from './index.css';

class HomePage extends React.Component {
  static propTypes = {
    signIn: React.PropTypes.func.isRequired
  }

  componentDidMount = () => {
    this.tryToFindToken();
  }

  tryToFindToken = () => {
    const token = window.location.href.split('?token=')[1];
    if (token) {
      this.props.signIn(token);
      browserHistory.push('/profile/courses-learned-by-me'); // needed?
    }
  }

  renderHeading = (text) =>
    <h2 className="section-heading"><i className="fa fa-superpowers"/>{text}</h2>

  render = () =>
    <main className={css.main}>
      <Header/>
      <div className="space"/>

      <article className="article-formatting">
        <div className="container -left-border">
          <section className="article-headings">
            <h1>Welcome to Memcode.</h1>

            <h3>
              Lightweight <b>spaced repetition</b>-based learning site.
            </h3>
          </section>

          <section className="article-section">
            {this.renderHeading('How do I use it?')}

            <p>
              You create a course with flashcards for some topic you want to learn.<br/>
              Then we ask you to review (give answers to) the flashcards we think you started forgetting.<br/>
            </p>

            <b>There are two types of flashcards, and that's how they look when you review them:</b>
            <ol>
              <li>
                You see a question, you give an answer and rate yourself according to your performance after seeing the actual answer:
                <FakeProblemWithSeparateAnswer/>
              </li>
              <li>
                You fill in missed words:
                <FakeProblemWithInlinedAnswers/>
              </li>
            </ol>
          </section>

          <section className="article-section">
            {this.renderHeading('How does it work?')}
            <p>
              We implement a variation of an <a href="https://www.supermemo.com/english/ol/sm2.htm">SM2</a> algorithm for <a href="https://en.wikipedia.org/wiki/Spaced_repetition">spaced repetition</a>.<br/>
              It's based on repeating something you want to learn in ever increasing inervals.<br/>
              <b>We learn the best when we just begin to forget</b>, and our purpose is to make you review your flashcards at the best timing.

              First review will happen in about 4 hours, next one in 24 hours, next in 3 days and so on.
            </p>
          </section>
        </div>

        <div className="container -left-border">
          <section className="article-section why-us">
            {this.renderHeading('Why use MemCode instead of <insert website>?')}
            <p>
              You may not need to! This site is tailored for a pretty specific style of learning.
              <br/>
            </p>
            It may be perfect for you though, if you:
            <ul>
              <li>
                Tend to create courses yourself rather than search for the existing ones
              </li>
              <li>
                Need formatting in a flashcard (eg code blocks, bold text, image addition)
              </li>
              <li>
                Want fill-in-sentence tasks and self-rated questions with hidden answers
              </li>
            </ul>
            <h3 className="table-caption">Here is a comparison table with popular flashcard-based learning sites:</h3>
          </section>
        </div>

        <Table/>

        <div className="container -left-border">
          <section className="article-section why-us -continuation">
            In general, you may want to use:<br/>
            <a href="http://www.memrise.com">Memrise</a> - for learning languages,<br/>
            <a href="http://www.codequizzes.com/">CodeQuizzes</a> - for learning code based on their limited collection,<br/>
            and <a href="http://www.memcode.com">Memcode</a> - for learning anything other than languages, if you like the types of tasks we provide, formatting ability and slick UI.
          </section>
        </div>
      </article>

      <footer>
        <div className="container">
          contact@memcode.com
          <i className="fa fa-envelope"/>
        </div>
      </footer>
    </main>
}

import { AuthenticationActions } from '~/reducers/Authentication';
const mapDispatchToProps = dispatch => ({
  signIn: (token) => AuthenticationActions.signIn(dispatch, token)
});

import { connect } from 'react-redux';
HomePage = connect(() => ({}), mapDispatchToProps)(HomePage);

export { HomePage };
