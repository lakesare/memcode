import { Heading } from './Heading';

const QualityOfCourses = () =>
  <section className="article-section" id="quality-of-courses">
    <Heading text="Quality Of Courses"/>

    <div className="sites">
      <section className="site">
        <h3>Memrise: <span>5</span></h3>

        <p>
          Many courses on languages, where each flashcard has 'memes' attached to it. It helps tremendously in learning foreign languages.<br/>
          <mark>Memrise</mark> doesn't offer any flashcard formatting, so courses that need images or even simple paragraphs (basically any technical course) are of worse quality.
        </p>
      </section>

      <section className="site">
        <h3>Quizlet: <span>5</span></h3>

        <p>
          <mark>Quizlet</mark> has a large collection of user-created courses, many of which are very good (including technical subjects!). They are sorted by popularity, and best ones are eazy to find.
        </p>
      </section>

      <section className="site">
        <h3>Brainscape: <span>3</span></h3>

        <p><mark>Brainscape</mark> is proud of its collection of expert-certified courses, however most of them require paid subscription.<br/>
        I checked a few certified courses though, and they felt like automatically imported dictionary definitions rather than something worth memorizing.</p>
      </section>

      <section className="site">
        <h3>Memcode: <span>?</span></h3>

        <p>
          There are basically no courses in this app.<br/>
          But <mark>Memcode</mark> was not built with rich course ecosystem in mind. This app is meant for users who tend to create their own courses.
        </p>
      </section>
    </div>
  </section>;

export { QualityOfCourses };
