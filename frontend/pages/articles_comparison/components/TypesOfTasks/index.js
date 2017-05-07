import { Heading } from '../Heading';

import memrise_1 from './memrise_1.gif';
import memrise_2 from './memrise_2.gif';

import quizlet_1 from './quizlet_1.gif';
import quizlet_2 from './quizlet_2.gif';
import quizlet_3 from './quizlet_3.gif';

import brainscape_1 from './brainscape_1.gif';

import memcode_1 from './memcode_1.gif';
import memcode_2 from './memcode_2.gif';

const TypesOfTasks = () =>
  <section className="article-section types-of-tasks" id="types-of-tasks">
    <Heading text="Types of tasks"/>

    <div className="sites">
      <section className="site">
        <h3>Memrise: <span>4</span></h3>

        <div className="description">
          <mark>Memrise</mark> randomly suggests two types of tasks (for the same flashcard), and requires you to complete them in about 10-30 seconds (depending on task dificulty):
          <ul>
            <li>
              Multiple choice questions
              <img src={`/${memrise_1}`}/>
            </li>
            <li>
              Typed-in answer that gets autochecked
              <img src={`/${memrise_2}`}/>
            </li>
          </ul>
        </div>
      </section>

      <section className="site">
        <h3>Quizlet: <span>5</span></h3>

        <div className="description">
          <mark>Quizlet</mark> lets you choose what types of tasks you want to exercise your memories with.
          <ul>
            <li>
              Typed-in answer that gets autochecked
              <img src={`/${quizlet_1}`}/>
            </li>
            <li>
              Classic flashcard
              <img src={`/${quizlet_2}`}/>
            </li>
            <li>
              Connect word and defintion:
              <img src={`/${quizlet_3}`}/>
            </li>
            <li>
              Type what you hear. <mark>Quizlet</mark> automatically voices (with good quality!) your questions and answers, speaks an answer to you, and checks how you typed it.
            </li>
            <li>
              Asteroid game. Expects you to type in answers quick, so that asteroids don't destroy you.
            </li>
            <li>
              Test-like sprint. Solve 20 tasks from the course with randomized task types, and get a grade.
            </li>
          </ul>
        </div>
      </section>

      <section className="site brainscape">
        <h3>Brainscape: <span>2</span></h3>

        <div className="description">
          <mark>Brainscape</mark> only features classical self-rated turn-over flashcards.
          <ul>
            <li><img src={`/${brainscape_1}`}/></li>
          </ul>
        </div>
      </section>

      <section className="site">
        <h3>Memcode: <span>5</span></h3>

        <div className="description">
          Unlike other apps, <mark>Memcode</mark> offers two distinct types of flashcards, which are intrinsic to each flashcard (you can't play type_1 on the type_2 card). Those are:
          <ul>
            <li>
              Classical flashcard, but implemented without the turn-over. It lets you reflect on what you just answered.
              Self-rated.
              <img src={`/${memcode_1}`}/>
            </li>
            <li>
              'Insert answer inline' task. Multiple answers in one task is possible. It's automatically checked as you type.
              <img src={`/${memcode_2}`}/>
            </li>
          </ul>
        </div>
      </section>

      <section className="conclusion">
        <h3>Conclusion</h3>
        <div className="description">
          <mark>Memrise</mark> and <mark>Memcode</mark> are suitable for fast learning, their interface is slick, they can be manipulated using keyboard.<br/>
          <mark>Quizlet</mark> on the other hand clearly attempts to gamify the learning process. It's refreshing to be able to switch the task types, but there is too much going on to be able to parse through your items at a fast pace.<br/>
          <mark>Brainscape</mark> is the only clear loser here. Process is both nonfun and slow with it.
        </div>
      </section>
    </div>
  </section>;

export { TypesOfTasks };
