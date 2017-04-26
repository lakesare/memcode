import React from 'react';

import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';

import { LearningAlgorithm } from './components/LearningAlgorithm';
import { TypesOfTasks } from './components/TypesOfTasks';

class Page_articles_comparison extends React.Component {
  render = () =>
    <main className="">
      <Header/>
      <div className="space"/>

      <article className="article-formatting">

        <div className="container -left-border">
          <section className="article-headings">
            <h1>Memrise VS Quizlet VS Brainscape VS Memcode</h1>

            <h3>
              Comparison of popular <b>repetition-based learning</b> sites.
            </h3>
          </section>

          <section className="article-section">
            <p>All of these sites are based on a technique for learning called <b>spaced repetition</b>.</p>
          </section>

          <TypesOfTasks/>
          <LearningAlgorithm/>

        </div>
      </article>

      <Footer/>
    </main>
}

export { Page_articles_comparison };
