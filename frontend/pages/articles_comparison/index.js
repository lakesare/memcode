import { Helmet } from 'react-helmet';

import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';

import { LearningAlgorithm } from './components/LearningAlgorithm';
import { TypesOfTasks } from './components/TypesOfTasks';
import { UI } from './components/UI';
import { WhenToUseEach } from './components/WhenToUseEach';
import { QualityOfCourses } from './components/QualityOfCourses';

import css from './index.css';

class Page_articles_comparison extends React.Component {
  componentDidMount = () =>
    document.addEventListener("scroll", this.fixNavigation);

  componentWillUnmount = () =>
    document.removeEventListener("scroll", this.fixNavigation);

  fixNavigation = () => {
    if (window.scrollY > 35) {
      this.refs.nav.classList.add("fixed");
    } else {
      this.refs.nav.classList.remove("fixed");
    }
  }

  render = () =>
    <main className={css.main}>
      <Header/>

      <div className="space"/>

      <article className="article-formatting">

        <div className="container -left-border">
          <section className="article-headings">
            <h1><mark>Memrise</mark> vs <mark>Quizlet</mark> vs <mark>Brainscape</mark> vs <mark>Memcode</mark></h1>

            <h3>
              Comparison of popular <b>repetition-based learning</b> sites.
            </h3>
          </section>

          <section className="article-section">
            I've been using <mark>Memrise</mark> for many years now.<br/>
            I began using it to learn languages and then proceeded to use it for maths and programming.<br/>
            Knowledge retention rates have been uncomparable to classical study methods, so it's been a great experience overall.<br/>
            I was having a few critical issues with <mark>Memrise</mark> though, which led me to try and find some more <b>spaced-repetition based learning</b> sites, and consequently create my own.<br/>
            Here is a description of my experience with <mark>Memrise</mark>, <mark>Quizlet</mark> and <mark>Brainscape</mark>.

            <div className="how-did-I-choose-sites-for-comparison">
              <h4>How did I choose sites for comparison?</h4>

              My main criteria were:
              <ul>
                <li><b>It has to be web-based.</b> That's why I didn't include Anki (only desktop), or Flashcards Deluxe (only mobile). I conisder browser to be the most comfortable environment.</li>
                <li><b>It has to be popular.</b> I did check out a few less popular sites, and some of those were better than the ones I chose. For my purposes, however, they were not better than Memcode.</li>
                <li><b>The site has to offer an ability to create your own courses.</b> Again, because that's where Memcode can compete. Duolingo and Codequizzes are beautiful sites with great courses, but you can't create your own.</li>
              </ul>
            </div>
          </section>

          <QualityOfCourses/>
          <TypesOfTasks/>
          <LearningAlgorithm/>
          <UI/>
          <WhenToUseEach/>
        </div>
      </article>

      <Footer/>

      <Helmet>
        <title>Memrise VS  Quizlet VS Brainscape VS Memcode</title>
        <meta name="description" content="Memrise VS  Quizlet VS Brainscape VS Memcode: comparison of most popular flashcard learning sites."/> :
      </Helmet>
    </main>
}

export default Page_articles_comparison;
