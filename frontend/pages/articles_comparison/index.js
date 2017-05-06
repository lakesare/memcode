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
      <nav className="article-navigation" ref="nav">
        <div className="container">
          <a href="#quality-of-courses">Quality Of Courses</a>
          <a href="#types-of-tasks">Types Of Tasks</a>
          <a href="#ui">UI</a>
          <a href="#learning-algorithm">Learning Algorithm</a>
          <a href="#when-to-use-each">When To Use Each?</a>
        </div>
      </nav>

      <div className="space"/>

      <article className="article-formatting">

        <div className="container -left-border">
          <section className="article-headings">
            <h1><mark>Memrise</mark> vs <mark>Quizlet</mark> vs <mark>Brainscape</mark> vs <mark>Memcode</mark></h1>

            <h3>
              Comparison of popular <b>repetition-based learning</b> sites.
            </h3>
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

export { Page_articles_comparison };
