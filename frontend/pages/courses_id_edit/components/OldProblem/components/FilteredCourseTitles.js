import * as fuzzy from 'fuzzy';

const FilteredCourseTitles = (props) => {
  const options = {
    pre: '<b>',
    post: '</b>',
    extract: (course) => course.title // filter by what?
  };
  const filteredCourses = fuzzy.filter(props.searchString, props.courses, options);

  return <div className="course-titles">
    {
      filteredCourses.map((course) =>
        <div
          className="course-title"
          key={course.original.id}
          // yes, 'PropType is defined but prop is never used' is a linting error
          // https://github.com/yannickcr/eslint-plugin-react/issues/885
          /* eslint-disable */ 
          onClick={() => props.apiMoveProblemToCourse(course.original.id)}
        >
          <div dangerouslySetInnerHTML={{ __html: course.string }}/>
        </div>
      )
    }
  </div>;
};

FilteredCourseTitles.propTypes = {
  courses: PropTypes.array.isRequired,
  searchString: PropTypes.string.isRequired,
  apiMoveProblemToCourse: PropTypes.func.isRequired
};

export { FilteredCourseTitles };
