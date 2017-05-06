import { Heading } from './Heading';

const LearningAlgorithm = () =>
  <section className="article-section" id="learning-algorithm">
    <Heading text="Learning Algorithm?"/>

    <div className="sites">
      <section className="site">
        <h3>Memrise: <span>5</span></h3>

        <p>
          SM2, approximate frequency of review with all the answers given right:<br/>
          4 hours, 12 hours, 1 day, 6 days, 12 days, 24 days, 48 days, 96 days, 180 days
        </p>
      </section>

      <section className="site">
        <h3>Quizlet: <span>0</span></h3>

        <p>
          Basic: either know or don't know.
        </p>
      </section>

      <section className="site">
        <h3>Brainscape: <span>5</span></h3>

        <p>
          SM2
        </p>
      </section>

      <section className="site">
        <h3>Memcode: <span>5</span></h3>

        <p>
          SM2, approximate frequency of review with all the answers given right:<br/>
          4 hours, 1 day, 4 days, 8 days, 13 days, 19 days, 25 days, 32 days, 41 days, etc.
        </p>
      </section>

      <section className="conclusion">
        <h3>Conclusio<span>n</span></h3>

        <p>
          Everyone here uses some variation of SM2 (an algorithm that generally calculates the increase of repetition intervals over how well you know the item), except for <mark>Quizlet</mark>. Which essentially makes <mark>Quizlet</mark> unsuitable for any kind of long-term learning.
        </p>
      </section>
    </div>
  </section>;

export { LearningAlgorithm };
