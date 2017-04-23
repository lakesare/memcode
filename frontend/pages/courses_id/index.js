import React from 'react';

import { Header } from '~/components/Header';
import { Loading } from '~/components/Loading';

import { CourseActions } from '~/components/CourseActions';
import { Problem } from '~/components/Problem';

import { commonFetch } from '~/api/commonFetch';

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
      speGetPage: {}
    };
  }

  componentDidMount = () =>
    commonFetch(
      spe => this.setState({ speGetPage: spe }),
      'GET', `/api/pages/courses/${this.props.params.id}`
    );

  render = () =>
    <main className={css.main}>
      <Header/>

      <div className="container">
        <CourseActions courseId={this.props.params.id}/>

        <Loading spe={this.state.speGetPage}>{({ problems, course }) =>
          <div className="description-and-problems">
            {
              course.description &&
              course.description.length > 0 &&
              <section className="description" dangerouslySetInnerHTML={{ __html: course.description }}/>
            }
            <section className="problems">
              {
                problems.map((problem) =>
                  <Problem
                    key={problem.id}
                    mode="viewing"
                    problemContent={problem.content}
                    problemType={problem.type}
                  />
                )
              }
            </section>
          </div>
        }</Loading>
      </div>
    </main>
}

export { Page_courses_id };
