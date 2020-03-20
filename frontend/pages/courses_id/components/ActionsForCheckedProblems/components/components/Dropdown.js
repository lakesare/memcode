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
        this.deriveFilteredCourses().map((course) =>
          <li
            key={course.original.id}
            className="course-title"
          >
            <button
              type="button"
              onClick={() => this.props.uiSelectCourse(course.original)}
            >
              <div dangerouslySetInnerHTML={{ __html: course.string }}/>
            </button>
          </li>
        )
      }
    </ul>
}

export { Dropdown };
