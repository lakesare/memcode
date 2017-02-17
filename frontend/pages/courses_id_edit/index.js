import React from 'react';

import { Header }       from '~/components/Header';
import { Loading } from '~/components/Loading';
import { Problem } from './components/Problem';

import { apiGetCourse } from '~/ducks/courses/actions';

class Page_courses_id_edit extends React.Component {
  static propTypes = {
    params: React.PropTypes.shape({
      id: React.PropTypes.string
    }).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      speGetCourse: {}
    };
  }

  componentDidMount = () => {
    apiGetCourse(
      spe => this.setState({ speGetCourse: spe }),
      this.props.params.id
    );
  }

  renderListOfProblems = problems =>
    problems.map((problem, index) =>
      <Problem
        key={problem.id}
        problem={problem}
        index={index + 1}
      />
    )

  render = () =>
    <main>
      <Header/>

      <div className="container">
        <Loading spe={this.state.speGetCourse}>{payload =>
          <div>
            <h1>{payload.course.title}</h1>

            {this.renderListOfProblems(payload.problems)}
          </div>
        }</Loading>
      </div>
    </main>
}

export { Page_courses_id_edit };
