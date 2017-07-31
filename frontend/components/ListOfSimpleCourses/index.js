import { Course } from './components/Course';

import css from './index.css';

class ListOfSimpleCourses extends React.Component {
  static propTypes = {
    coursesData: PropTypes.array.isRequired,
  }

  renderLayoutDivs = () =>
    // eslint-disable-next-line react/no-array-index-key
    [...Array(10)].map((_, i) => <div key={i} className="layout-div"/>)

  render = () =>
    <section className={`${css['list-of-courses']} list-of-courses`}>
      {
        this.props.coursesData.map(({ course, amountOfProblems }) =>
          <Course key={course.id} course={course} amountOfProblems={amountOfProblems}/>
        )
      }
      {this.renderLayoutDivs()}
    </section>
}

export { ListOfSimpleCourses };
