import { Heading } from './Heading';
import { Site } from './Site';
import { Conclusion } from './Conclusion';

const LearningAlgorithm = () =>
  <section className="article-section" id="learning-algorithm">
    <Heading text="Learning Algorithm"/>

    <div className="sites">
      <Site name="Memrise" rating="5">
        SM2, approximate frequency of review with all the answers given right:<br/>
        <span className="intervals">4 hours, 12 hours, 1 day, 6 days, 12 days, 24 days, 48 days, 96 days, 180 days</span>
      </Site>

      <Site name="Quizlet" rating="0">
        Basic: either know or don't know.
      </Site>

      <Site name="Brainscape" rating="5">
        SM2
      </Site>

      <Site name="Memcode" rating="5">
        SM2, approximate frequency of review with all the answers given right:<br/>
        <span className="intervals">4 hours, 1 day, 4 days, 8 days, 13 days, 19 days, 25 days, 32 days, 41 days, etc.</span>
      </Site>

      <Conclusion>
        Everyone here uses some variation of SM2 (an algorithm that calculates the increase of repetition intervals depending on how well you know the item. Its ultimate goal is to make you repeat the flashcard as soon as you start forgetting it), except for <mark>Quizlet</mark>. This essentially makes <mark>Quizlet</mark> unsuitable for any kind of long-term learning.
      </Conclusion>
    </div>
  </section>;

export { LearningAlgorithm };
