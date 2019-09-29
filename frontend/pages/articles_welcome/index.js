import { withRouter, Link } from 'react-router-dom';

import Header from '~/components/Header';
import Footer from '~/components/Footer';
import SignInButtons from '~/appComponents/SignInButtons';
import FakeFlashcards from './components/FakeFlashcards';
import Courses from './components/Courses';

import creationImage from './images/creation.jpg';
import heartImage from './images/heart.png';

import css from './index.css';
import { AuthenticationActions } from '~/reducers/Authentication';
@withRouter
@connect(
  () => ({}),
  (dispatch) => ({
    signIn: (token) => AuthenticationActions.signIn(dispatch, token)
  })
)
class Page_articles_welcome extends React.Component {
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

  renderHeading = (text, className) =>
    <h2 className={`section-heading ${className}`}>
      {text}
    </h2>

  renderExplanation = (text) =>
    <div className="section-explanation">
      {text}
    </div>

  render = () =>
    <main className={css.main}>
      <Header/>

      <article className="standard-article-formatting">
        <div className="container">
          <section className="article-headings">
            <h1 className="-glow">Welcome to Memcode</h1>
            <h2 className="subtitle">Memorizing is hard. Let's make everything else easy.</h2>

            <h2 className="more">
              Lightweight <mark>spaced repetition</mark>-based learning site.<br/>
              {/* Thought-through to the detail.<br/> */}
              <span style={{ color: 'rgba(39, 209, 158, 0.84)' }}>With formatting. </span>
              <span style={{ color: 'rgb(244, 126, 177)' }}>With images. </span>
              <span style={{ color: 'rgb(255, 255, 137)' }}>Accessible.</span>
            </h2>

            <Link to="/please-sign-in" className="button -orange -move-up-on-hover -with-radius" type="button">Use for Free, Forever →</Link>

            {/* <hr/> */}
          </section>

          <section className="article-section two-types-of-flashcards">
            {this.renderHeading('Two types of flashcards')}

            <FakeFlashcards/>
          </section>

          <section className="article-section creation">
            {this.renderHeading('Comfortable, blazingly fast course creation')}

            {this.renderExplanation(<>Course creators are first class citizens on Memcode.<br/> We made it fun and beautiful.</>)}

            <img src={creationImage} alt="Two text editors with formatting options"/>

            <Link to="/please-sign-in" className="button -orange -move-up-on-hover -with-radius" type="button">Create your own course →</Link>
          </section>

          <section className="article-section courses">
            {this.renderHeading('Play selected courses')}

            {this.renderExplanation(<>You can play all courses without signing in, - sign in as soon as you'd like us to offer you flashcards for review based on your progress!</>)}

            <Courses/>
          </section>

          <section className="article-section sign-in">
            {this.renderHeading('Welcome', '')}

            {/* <img src={heartImage} alt=""/></div> */}

            {/* {this.renderExplanation(<>Sign in:</>)} */}

            <SignInButtons text="Sign In With"/>
          </section>

        </div>
      </article>

      <Footer/>
    </main>
}

export default Page_articles_welcome;
