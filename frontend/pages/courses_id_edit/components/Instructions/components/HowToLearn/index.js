import add_to_learned_courses from './add_to_learned_courses.png';
import learn from './learn.png';
import review from './review.png';

class HowToLearn extends React.Component {
  render = () =>
    <div className="what-to-do-next">
      <ul>
        <li>Click on <img src={`/${add_to_learned_courses}`}/>. This will display this course on your profile's page, and you'll get an access to learning and reviewing courses.</li>
        <li>Click on <img src={`/${learn}`}/>. Here you can read through the flashcards you created, and mark them as learned (if you feel like it) by clicking on them.</li>
        <li>Click on <img src={`/${review}`}/>. Repeat the flashcards you have learned!</li>
      </ul>
    </div>
}

export { HowToLearn };
