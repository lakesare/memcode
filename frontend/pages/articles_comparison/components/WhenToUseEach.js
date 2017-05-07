import { Heading } from './Heading';

const WhenToUseEach = () =>
  <section className="article-section" id="when-to-use-each">
    <Heading text="So when to use each?"/>

    <div className="sites">
      <section className="site">
        <h3>Memrise: <span>When you want to learn some language.</span></h3>

        <div className="description">
          <mark>Memrise</mark> was created with this in mind, hence is the inability to format tasks or limits on their length.<br/>
          I had a great experience using the 'meme' feature (you and other users create images that help them remember the word) feature when I was learning finnish. It will be beneficial for any cryptic syntaxis, but not so much for fields such as programming or physics, where memories mostly form by connecting the known concepts rather than by memorizing some particular syntax.
        </div>
      </section>

      <section className="site">
        <h3>Quizlet: <span>When you want to cram for a test.</span></h3>

        <div className="description">
          <mark>Quizlet</mark> was created with this in mind.<br/>
          It's not meant to be used for a long period of time, that's why they didn't introduce any learning algorithm. It's meant to be 'learn now' app. And it's great in what it does!<br/>
          You will not get lost on a real test after you try to revoke your newly-fledged memories using 6 different types of tasks.<br/>
          Another use case for this app is a unique automatic voiceover feature. You may want to use it to train your listening skills in some language, or to learn with your eyes closed :-).<br/>
          One more thing <mark>Quizlet</mark> excells in is gamification. <mark>Quizlet</mark> took it to its logical end, you will hardly get bored by learning anything there.
        </div>
      </section>

      <section className="site">
        <h3>Brainscape: <span>Never?</span></h3>

        <div className="description">
          Probably if you want to prepare for a particular expert-approved course (SAT, IELTS).
          In general it has a bulky interface, and I didn't find courses to be very inspiring.
        </div>
      </section>

      <section className="site">
        <h3>Memcode: <span>Any long-term learning of self-created data.</span></h3>

        <div className="description">
          If you mostly create courses yourself, if you need formatting or image insertion, and if you enjoy minimalistic fast thought-through interfaces.
        </div>
      </section>

      <section className="conclusion">
        <h3>Conclusion</h3>

        <div className="description">
          Every app excells at their use cases, apart from probably <mark>Brainscape</mark>.
        </div>
      </section>
    </div>
  </section>;

export { WhenToUseEach };
