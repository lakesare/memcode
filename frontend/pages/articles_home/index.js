import Header from '~/components/Header';
import Footer from '~/components/Footer';
import { FakeProblemWithInlinedAnswers } from './components/FakeProblemWithInlinedAnswers';
import { FakeProblemWithSeparateAnswer } from './components/FakeProblemWithSeparateAnswer';
import { Table } from './components/Table';

import { withRouter } from "react-router-dom";

import css from './index.css';

import { AuthenticationActions } from '~/reducers/Authentication';
@withRouter
@connect(
  () => ({}),
  (dispatch) => ({
    signIn: (token) => AuthenticationActions.signIn(dispatch, token)
  })
)
class Page_articles_home extends React.Component {
  static propTypes = {
    signIn: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  }

  componentDidMount = () => {
    this.tryToFindToken();
  }

  tryToFindToken = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    if (token) {
      this.props.signIn(token);
      this.props.history.push('/courses/learning');
    }
  }

  renderHeading = (text) =>
    <h2 className="section-heading">
      {text}
    </h2>

  render = () =>
    <main className={css.main}>
      <Header/>

      <article className="standard-article-formatting">
        <div className="container">
          <section className="article-headings">
            <h1>Welcome to Memcode.</h1>

            <h2>
              Lightweight <mark>spaced repetition</mark>-based learning site.
            </h2>
          </section>

          <section className="article-section">
            {this.renderHeading('How do I use Memcode?')}

            <p>
              Create a course with flashcards for a subject you’re interested in.<br/>
              To keep it in your long term memory, we ask you to review the flashcards you’re starting to forget.
            </p>

            <b>Two types of flashcards:</b>
            <ol>
              <li>
                Type in an answer and rate yourself according to your memory recall
                <FakeProblemWithSeparateAnswer/>
              </li>
              <li>
                Fill in the blank
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
            Here is a more detailed comparison of Memcode, Memrise, Braincode and Quizlet: <a href="http://www.memcode.com/articles/comparison">memcode.com/articles/comparison</a>.
          </section>
        </div>
      </article>

      <Footer/>
    </main>
}

export default Page_articles_home;
