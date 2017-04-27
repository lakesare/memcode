import React from 'react';

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
          onClick={() => props.apiMoveProblemToCourse(course.original.id)}
        >
          <div dangerouslySetInnerHTML={{ __html: course.string }}/>
        </div>
      )
    }
  </div>;
};

FilteredCourseTitles.propTypes = {
  courses: React.PropTypes.array.isRequired,
  searchString: React.PropTypes.string.isRequired,
  apiMoveProblemToCourse: React.PropTypes.func.isRequired
};

export { FilteredCourseTitles };
