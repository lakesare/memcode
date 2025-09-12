import { Heading } from '../Heading';

import memrise_1 from './memrise_1.gif';
import memrise_2 from './memrise_2.gif';

import quizlet_1 from './quizlet_1.gif';
import quizlet_2 from './quizlet_2.gif';
import quizlet_3 from './quizlet_3.gif';

import brainscape_1 from './brainscape_1.gif';

import memcode_1_new from './memcode_1_new.gif';
import memcode_2_new from './memcode_2_new.gif';

const TypesOfTasks = () =>
  <section className="article-section" id="types-of-tasks">
    <Heading text="Types of tasks"/>

    <div className="sites">
      <section className="site">
        <h3>Memrise: <span className="rating">4</span></h3>

        <div className="description">
          <mark>Memrise</mark> randomly suggests two types of tasks (for the same flashcard) and requires you to complete them in about 10-30 seconds (depending on task difficulty):
          <ul className="list-of-flashcard-types">
            <li>
              Multiple choice questions
              <img src={memrise_1} alt="Memrise flashcard type: multiple choice question"/>
            </li>
            <li>
              Typed-in answer that gets autochecked
              <img src={memrise_2} alt="Memrise flashcard type: typed-in answer that gets automatically checked"/>
            </li>
          </ul>
        </div>
      </section>

      <section className="site">
        <h3>Quizlet: <span className="rating">5</span></h3>

        <div className="description">
          <mark>Quizlet</mark> lets you choose which types of tasks you want to exercise your memory with.
          <ul className="list-of-flashcard-types">
            <li>
              Typed-in answer that gets autochecked
              <img src={quizlet_1} alt="Quizlet flashcard type: Typed-in answer that gets autochecked"/>
            </li>
            <li>
              Classic flashcard
              <img src={quizlet_2} alt="Quizlet flashcard type: Classic question-answer"/>
            </li>
            <li>
              Connect word and definition:
              <img src={quizlet_3} alt="Quizlet flashcard type: Connect word and definition"/>
            </li>
            <li>
              Type what you hear. <mark>Quizlet</mark> automatically voices (with good quality!) your questions and answers, speaks the answer and checks how you typed it.
            </li>
            <li>
              Asteroid game. Expects you to type in answers quickly, <br/>so that asteroids don't destroy you.
            </li>
            <li>
              Test-like sprint. Solve 20 tasks from the course with randomized task types, and get a grade.
            </li>
          </ul>
        </div>
      </section>

      <section className="site brainscape">
        <h3>Brainscape: <span className="rating">2</span></h3>

        <div className="description">
          <mark>Brainscape</mark> only features classical self-rated turn-over flashcards.
          <ul className="list-of-flashcard-types">
            <li><img src={brainscape_1} alt="Brainscape flashcard type: classic turn-over flashcard"/></li>
          </ul>
        </div>
      </section>

      <section className="site">
        <h3>Memcode: <span className="rating">5</span></h3>

        <div className="description">
          Unlike other apps, <mark>Memcode</mark> offers two distinct types of flashcards, which are intrinsic to each flashcard (you can't play type_1 on the type_2 card). Those are:
          <ul className="list-of-flashcard-types">
            <li>
              Classic 'Question-Answer' flashcard, but implemented without the turn-over (see Brainscape, e.g.). It lets you reflect on what you just answered.
              Self-rated.
              <img src={memcode_1_new} alt="Memcode flashcard type: Classic question-answer"/>
            </li>
            <li>
              'Insert answer inline' (or cloze-deletion) flashcard. If you type the right answer, the input will light up in green, indicating your answer is correct. If you can't recall an answer, just press ENTER, and the right answer will be revealed.
              <img src={memcode_2_new} alt="Memcode flashcard type: Automatically checked cloze-deletion flashcard"/>
            </li>
          </ul>
        </div>
      </section>

      <section className="conclusion">
        <h3>Conclusion</h3>
        <div className="description">
          <mark>Memrise</mark> and <mark>Memcode</mark> are suitable for fast learning, their interface is slick, they can be navigated via the keyboard.<br/>
          Unlike <mark>Memrise</mark>, however, <mark>Memcode</mark> has rich formatting available for flashcards, which means we have bold text, images, lists, code excerpts, and math formulas in our flashcards. These are essential if you are learning something more extensive than languages (coding, medicine, math—and even with languages, images won't hurt).<br/>
          <mark>Memrise</mark> also doesn't have cloze deletion cards, which are extremely helpful for learning foreign words in the context of the sentences they appear in.<br/>
          <mark>Quizlet</mark> on the other hand clearly attempts to gamify the learning process. It's refreshing to be able to switch the task types, but there is too much going on to be able to parse through your items at a fast pace.<br/>
          <mark>Brainscape</mark> is the only clear loser here. The process is both unfun and slow with it.
        </div>
      </section>
    </div>
  </section>;

export { TypesOfTasks };
