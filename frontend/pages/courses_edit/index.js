import React from 'react';

import { Header } from '~/components/header';
import { NewCourse } from '~/components/courses';
import { Loading } from '~/components/Loading';

import { apiGetCourse, apiUpdateCourse } from '~/ducks/courses/actions';

import { problemContentToTextarea } from '~/services/problemContentToTextarea';


// browserHistory.push(`/courses/${courseId}`);
class Page_course_edit extends React.Component {
  static propTypes = {
    params: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      speGetCourse: {},
      speUpdateCourse: {}
    };
  }

  componentDidMount = () => {
    apiGetCourse(
      spe => this.setState({ speGetCourse: spe }),
      this.props.params.id
    );
  }

  apiUpdateCourse = (values) => {
    apiUpdateCourse(
      spe => this.setState({ speUpdateCourse: spe }),
      this.props.params.id,
      values
    );
  }

  render = () =>
    <section>
      <Header/>

      <div className="container">
        <h1>Edit course</h1>
        <Loading spe={this.state.speGetCourse}>{({ course, problems }) =>
          <NewCourse
            initialValues={{
              course,
              problems: problems.map(problem => ({ ...problem, content: problemContentToTextarea(problem.content) }))
            }}
            onSubmit={this.apiUpdateCourse}
          />
        }</Loading>
      </div>
    </section>
}

export { Page_course_edit };
