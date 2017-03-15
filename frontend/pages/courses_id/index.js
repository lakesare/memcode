import React from 'react';

import { Header } from '~/components/Header';
import { Loading } from '~/components/Loading';

import { Actions } from './components/Actions';
import { Problem } from '~/components/Problem';

import * as CourseApi from '~/api/Course';

import css from './index.css';

class Page_courses_id extends React.Component {
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
    CourseApi.show(
      spe => this.setState({ speGetCourse: spe }),
      this.props.params.id
    );
  }

  render = () =>
    <main className={css.main}>
      <Header/>
      <Loading spe={this.state.speGetCourse}>{({ course, problems }) =>
        <div className="container">

          <Actions course={course}/>

          {
            problems.map((problem) =>
              <Problem
                key={problem.id}
                mode="viewing"
                initialContentEditorState={problem.content}
                initialExplanationEditorState={problem.explanation}
              />
            )
          }
        </div>
      }</Loading>
    </main>
}

export { Page_courses_id };
