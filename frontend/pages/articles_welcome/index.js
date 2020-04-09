import { withRouter, Link } from 'react-router-dom';

import Main from '~/appComponents/Main';
import SignInButtons from '~/appComponents/SignInButtons';
import FakeFlashcards from './components/FakeFlashcards';
import Courses from './components/Courses';

import creationImage from './images/creation.jpg';
import heartImage from './images/redheart.png';
import likeImage from './images/like.png'
import faceImage from './images/faces.png'
import darkModeImage from './images/darkmode.png'
import rainbowImage from './images/rainbow.png'

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
    <Main className={css.main}>
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

          <section className="article-section features">
            {this.renderHeading('Key Features')}
            
            <div class="feature-box">
                <img src={heartImage} alt="We love GIF"/>
                <h5>We love GIF</h5>
                <p>One of the very few sites with GIF enabled!</p>
            </div>

            <div class="feature-box">
                <img src={darkModeImage} alt="Fun to Use"/>
                <h5>Dark Mode</h5>
                <p>Good to study at night time. Look at our colours!</p>
            </div>

            <div class="feature-box">
                <img src={rainbowImage} alt="Beautiful"/>
                <h5>Beautiful</h5>
                <p>Beautiful and Elegant!</p>
            </div>
            
          </section>

          <section className="article-section sign-in">
            {this.renderHeading('Welcome', '')}

            {/* <img src={heartImage} alt=""/></div> */}

            {/* {this.renderExplanation(<>Sign in:</>)} */}

            <SignInButtons text="Sign In With"/>
          </section>

        </div>
      </article>
    </Main>
}

export default Page_articles_welcome;
