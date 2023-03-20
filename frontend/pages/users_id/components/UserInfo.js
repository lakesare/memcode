import capitalize from '~/services/capitalize';

import { Pie } from 'react-chartjs-2';
import Loading from '~/components/Loading';

import { Chart, ArcElement, Tooltip } from "chart.js";
Chart.register(ArcElement, Tooltip);

class UserInfo extends React.Component {
  static propTypes = {
    speGetPage: PropTypes.object.isRequired
  }

  getDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  renderUser = (user) =>
    <div className="user">
      <div className="user-details">
        <h1>Profile</h1>
        <img src={user.avatarUrl} alt="avatar"/>
        <div className="right">
          <div className="username">{capitalize(user.username)}</div>

          <div className="created-at">
            Joined {this.getDate(user.createdAt)}
          </div>
        </div>
      </div>
    </div>

  renderSkills = (skills) => {
    let max;
    if (!skills[0]) {
      skills = [
        { categoryName: 'Computer Science', nOfFlashcards: 0 },
        { categoryName: 'Mathematics', nOfFlashcards: 0 },
        { categoryName: 'Biology', nOfFlashcards: 0 },
        { categoryName: 'Politics', nOfFlashcards: 0 },
        { categoryName: 'Literature', nOfFlashcards: 0 },
      ];
      max = 1;
    } else {
      max = skills[0].nOfFlashcards;
    }

    return <div className="skills">
      <h1>Skills</h1>
      {skills.map((skill) =>
        <div className="skill" key={skill.categoryName}>
          <h2>{skill.categoryName}</h2>

          <section className="progress-bar">
            <span className="n-of-flashcards">{skill.nOfFlashcards} flashcards</span>
            <div className="inner" style={{ width: ((skill.nOfFlashcards / max) * 100).toString() + '%' }}/>
          </section>
        </div>
      )}
    </div>;
  }

  renderStats = (stats) => {
    // const max = skills[0].nOfFlashcards;
    const greenLong = '#09cc54';
    const greenMiddle = '#6fca92';
    const greenShort = '#9cc4ab';

    const data = {
      labels: [
        '  Long-term memories',
        '  Middle-term memories',
        '  Fresh memories'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: stats.easiness.longTerm === 0 && stats.easiness.middleTerm === 0 && stats.easiness.shortTerm === 0 ?
          [0, 0, 1] :
          [stats.easiness.longTerm, stats.easiness.middleTerm, stats.easiness.shortTerm],
        backgroundColor: [greenLong, greenMiddle, greenShort],
        hoverOffset: 0,
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 1,
        hoverBackgroundColor: [greenLong, greenMiddle, greenShort]
      }],
      // responsive: true,
      // maintainAspectRatio: false
    };

    const toPercent = (easinessFor) =>
      stats.nOfProblemsLearned === 0 ?
        0 :
        Math.round((stats.easiness[easinessFor] / stats.nOfProblemsLearned) * 100, 2);

    return <div className="stats">
      <h1>Progress</h1>

      <div className="wrapper">
        <div className="left" style={{ width: 200, marginTop: 8 }}>
          <Pie data={data}/>
        </div>

        <div className="right" style={{ marginTop: 12 }}>
          <ul className="textual-stats">
            <li className="stat">
              {stats.nOfCoursesCreated} courses created
            </li>

            <li className="stat">
              {stats.nOfProblemsLearned} flashcards learned:
              <ul className="memory-levels">
                <li>
                  <div className="square" style={{ background: greenLong }}/>
                  {toPercent('longTerm')}% in long-term memory
                </li>
                <li>
                  <div className="square" style={{ background: greenMiddle }}/>
                  {toPercent('middleTerm')}% in middle-term memory
                </li>
                <li>
                  <div className="square" style={{ background: greenShort }}/>
                  {toPercent('shortTerm')}% freshly learned
                </li>
              </ul>
            </li>

            {/* <li className="stat"> */}
            {/*   Soon: */}
            {/*   <ul className="memory-levels"> */}
            {/*     <li>+ 0 flashcards to review in the next hour</li> */}
            {/*     <li>+ 20 flashcards to review in the next 24 hours</li> */}
            {/*     <li>+ 300 flashacards to review in the next week</li> */}
            {/*   </ul> */}
            {/* </li> */}
          </ul>
        </div>
      </div>


    </div>;
  }

  render = () =>
    <Loading spe={this.props.speGetPage}>{({ user, skills, stats }) =>
      <div className="wrapper">
        {this.renderUser(user)}
        {this.renderSkills(skills)}
        {this.renderStats(stats)}
      </div>
    }</Loading>
}

export default UserInfo;
