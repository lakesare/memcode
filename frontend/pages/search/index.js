import React from 'react';
import Main from '~/appComponents/Main';

import api from '~/api';

class Page_search extends React.Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
  }

  state = {
    courses: []
  }

  componentDidMount = () => {
    const searchString = new URLSearchParams(this.props.location.search).get('string');
    console.log(searchString);

    this.apiGetCoursesWeSearchFor(searchString);
  }

  apiGetCoursesWeSearchFor = (searchString) => {
    api.CourseApi.find(
      false,
      { searchString }
    )
      .then((coursesFromApi) => {
        this.setState({ courses: coursesFromApi });
      });
  }

  render = () =>
    <Main>
      <div className="container">
        <div className="space"/>
        <article>
          <h2>Hello, this is our search page!</h2>

          <h1>{5 + 2}</h1>

          <h1>{new URLSearchParams(this.props.location.search).get('string')}</h1>

          <ul>
            {
              this.state.courses.map((course) => {
                return <li>{course.title}</li>;
              })
            }
          </ul>
        </article>
      </div>
    </Main>
}

export default Page_search;
