import React from 'react';

import { Problem } from '~/components/Problem';
import { Loading } from '~/components/Loading';
import { commonFetch } from '~/api/commonFetch';



class Page_test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speGetPage: {}
    };
  }

  componentDidMount = () =>
    commonFetch(
      spe => this.setState({ speGetPage: spe }),
      'GET', `/api/pages/courses/5`
    );

  render = () =>
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
}

export { Page_test };
