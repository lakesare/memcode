import { Heading } from './Heading';
import { Site } from './Site';
import { Conclusion } from './Conclusion';

const WhenToUseEach = () =>
  <section className="article-section" id="when-to-use-each">
    <Heading text="So, when to use each?"/>

    <div className="sites">
      <Site name="Memrise" answer="When you want to learn some language.">
        <mark>Memrise</mark> was created with this in mind, hence the inability to format tasks or limits on their length.<br/>
        I had a great experience using the 'meme' feature (you and other users create images that help them remember the word) when I was learning Finnish. It will be beneficial for any cryptic syntax, but not so much for fields such as programming or physics, where memories mostly form by connecting known concepts rather than by memorizing particular syntax.
      </Site>

      <Site name="Quizlet" answer="When you want to cram for a test.">
        <mark>Quizlet</mark> was created with this in mind.<br/>
        It's not meant to be used for a long period of time, that's why they didn't introduce any learning algorithm. It's meant to be the 'learn now' app. And it's great in what it does!<br/>
        You will not get lost on a real test after you try to recall your newly-formed memories using 6 different types of tasks.<br/>
        Another use case for this app is a unique automatic voiceover feature. You may want to use it to train your listening skills in some language, or to study with your eyes closed :-).<br/>
        One more thing <mark>Quizlet</mark> excels in is gamification. <mark>Quizlet</mark> took it to its logical end, so you will hardly get bored learning anything there.
      </Site>

      <Site name="Brainscape" answer="Never?">
        Probably if you want to prepare for a particular expert-approved course (SAT, IELTS).
        In general it has a bulky interface, and I didn't find courses to be very inspiring.
      </Site>

      <Site name="Memcode" answer="Any long-term learning of self-created data.">
        If you mostly create courses yourself, if you need formatting or image insertion, and if you enjoy minimalistic, fast, thought-through interfaces.
      </Site>

      <Conclusion>
        Every app excels at its use case, except probably <mark>Brainscape</mark>.
      </Conclusion>
    </div>
  </section>;

export { WhenToUseEach };
