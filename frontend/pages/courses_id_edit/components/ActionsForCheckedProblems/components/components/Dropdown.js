import * as fuzzy from 'fuzzy';

class Dropdown extends React.Component {
  static propTypes = {
    courses: PropTypes.array.isRequired,
    searchString: PropTypes.string.isRequired,
    uiSelectCourse: PropTypes.func.isRequired
  }

  deriveFilteredCourses = () => {
    const options = {
      pre: '<mark>',
      post: '</mark>',
      extract: (course) => course.title // filter by what?
    };
    const filteredCourses = fuzzy.filter(this.props.searchString, this.props.courses, options);
    return filteredCourses;
  }

  render = () =>
    <ul className="standard-dropdown -purple">
      {
        this.props.courses.length === 0 ?
          <li className="no-courses">You have not created any other courses yet, create one in order to move flashcards to it.</li> :
          this.deriveFilteredCourses().map((course) =>
            <li
              key={course.original.id}
              onClick={() => this.props.uiSelectCourse(course.original)}
              className="course-title"
            >
              <div dangerouslySetInnerHTML={{ __html: course.string }}/>
            </li>
          )
      }
    </ul>
}

export { Dropdown };
