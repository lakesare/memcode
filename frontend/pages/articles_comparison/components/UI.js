import { Heading } from './Heading';

const UI = () =>
  <section className="article-section" id="ui">
    <Heading text="UI"/>

    <div className="sites">
      <section className="site">
        <h3>Memrise: <span className="rating">4</span></h3>
        <div className="description">
          <b>Course creation:</b> fast and simple, however there are a few irritating moments which <mark>Memrise</mark> is not planning on fixing (yes, I wrote them a few emails). Intrusive autosuggest makes the process slower, and definitions longer than about 20 symbols can't be seen in their entirety.<br/>
          <b>Course learning:</b> fast and simple, but gets uncomfortable if it's something other than word-definition task due to the absence of formatting.
        </div>
      </section>

      <section className="site">
        <h3>Quizlet: <span className="rating">4</span></h3>

        <div className="description">
          <b>Course creation:</b> fast and simple. No formatting available, but newlines get respected.<br/>
          <b>Course learning:</b> UI itself is not confusing, but it's not immediately clear how you should go about learning your items. If you find <mark>Quizlet</mark>'s task types inspiring - they do a great job at presenting them to you.
        </div>
      </section>

      <section className="site">
        <h3>Brainscape: <span className="rating">2</span></h3>

        <div className="description">
          <b>Course creation:</b> a headache, not very intuitive.<br/>
          <b>Course learning:</b> simple but rather slow, because we are expected to manually turn over the flashcard, and then rate ourselves. It can be done through keystrokes, but there is a lot of flickering on the screen that distracts you from the content of your flashcards.
        </div>
      </section>

      <section className="site">
        <h3>Memcode: <span className="rating">5</span></h3>

        <div className="description">
          <b>Course creation:</b> fast and simple. <mark>Memcode</mark> is made with comfortable course creation in mind. Design is minimalistic, and everything is supposed to be done throuhg keystrokes, including formatting.<br/>
          <b>Course learning:</b> very fast, and screen stays static during one flashcard (you can always see task's content and your answer while you are solving it). Everything can be done through keystrokes.
        </div>
      </section>
    </div>
  </section>;

export { UI };
