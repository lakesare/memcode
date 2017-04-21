import React from 'react';

// import { Draft } from './components/Draft';
import { Problem } from '~/components/Problem';

import { commonFetch } from '~/api/commonFetch';

class Page_test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speGetPage: { status: 'initial' }
    };
  }

  componentDidMount() {
    commonFetch(
      spe => this.setState({ speGetPage: spe }),
      'GET', `/api/pages/courses/5`
    );
  }

  render = () => {
    const spe = this.state.speGetPage;
    if (spe.status === 'request') return <div>request</div>;
    if (spe.status === 'failure') return <div>{spe.error}</div>;
    if (spe.status === 'initial') return <div>initial</div>;

    const { problems, course } = spe.payload;
    return <div className="container">
      <h1>{course.title}</h1>
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
    </div>;
  }
}

export { Page_test };


// simple draft - okay
// simple fetch /api/pages/courses/5 - okay


