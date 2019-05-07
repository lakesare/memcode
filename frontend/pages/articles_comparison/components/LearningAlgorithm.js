import { Heading } from './Heading';

const LearningAlgorithm = () =>
  <section className="article-section" id="learning-algorithm">
    <Heading text="Learning Algorithm"/>

    <div className="sites">
      <section className="site">
        <h3>Memrise: <span className="rating">5</span></h3>

        <div className="description">
          SM2, approximate frequency of review with all the answers given right:<br/>
          4 hours, 12 hours, 1 day, 6 days, 12 days, 24 days, 48 days, 96 days, 180 days
        </div>
      </section>

      <section className="site">
        <h3>Quizlet: <span className="rating">0</span></h3>

        <div className="description">
          Basic: either know or don't know.
        </div>
      </section>

      <section className="site">
        <h3>Brainscape: <span className="rating">5</span></h3>

        <div className="description">
          SM2
        </div>
      </section>

      <section className="site">
        <h3>Memcode: <span className="rating">5</span></h3>

        <div className="description">
          SM2, approximate frequency of review with all the answers given right:<br/>
          4 hours, 1 day, 4 days, 8 days, 13 days, 19 days, 25 days, 32 days, 41 days, etc.
        </div>
      </section>

      <section className="conclusion">
        <h3>Conclusion</h3>

        <div className="description">
          Everyone here uses some variation of SM2 (an algorithm that calculates the increase of repetition intervals depending on how well you know the item. It's ultimate goal is to make you repeat the flashcard as soon as you start forgetting it), except for <mark>Quizlet</mark>. Which essentially makes <mark>Quizlet</mark> unsuitable for any kind of long-term learning.
        </div>
      </section>
    </div>
  </section>;

export { LearningAlgorithm };
