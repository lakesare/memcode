import { Heading } from './Heading';

const UI = () =>
  <section className="article-section" id="ui">
    <Heading text="UI"/>

    <div className="sites">
      <section className="site">
        <h3>Memrise: <span>3</span></h3>
        <p>
          <b>Course creation:</b> fast and simple, however there are a few irritating moments which <mark>Memrise</mark> is not planning on fixing. Intrusive autosuggest makes the process slower, and definitions longer than about 20 symbols can't be seen in their entirety.<br/>
          <b>Course learning:</b> fast and simple, but gets uncomfortable if it's something other than word-definition task due to the absence of formatting.
        </p>
      </section>

      <section className="site">
        <h3>Quizlet: <span>4</span></h3>

        <p>
          <b>Course creation:</b> fast and simple.<br/>
          <b>Course learning:</b> depends on a task type. The most widely used task types are simple and fast, but are distractive due to jumping data.
        </p>
      </section>

      <section className="site">
        <h3>Brainscape: <span>2</span></h3>

        <p>
          <b>Course creation:</b> a headache, not very intuitive.<br/>
          <b>Course learning:</b> simple but rather slow, because we are expected to manually turn over the flashcard, and them rate ourselves. It can be done through keystrokes, but there is a lot of flickering on the screen that distracts you from learning.
        </p>
      </section>

      <section className="site">
        <h3>Memcode: <span>5</span></h3>

        <p>
          <b>Course creation:</b> fast and simple. <mark>Memcode</mark> is made with this in mind. Design is minimalistic, and everything is supposed to be done throuhg keystrokes, including formatting.<br/>
          <b>Course learning:</b> very fast, and screen stays static during one flashcard. Everything can be done through keystrokes.
        </p>
      </section>
    </div>
  </section>;

export { UI };
