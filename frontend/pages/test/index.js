import React from 'react';

// import { Draft } from './components/Draft';

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
    if (spe.status === 'failure') return <div>failure</div>;
    if (spe.status === 'initial') return <div>initial</div>;

    const { problems, course } = spe.payload;
    return <div className="container">
      <h1>{course.title}</h1>
      {
        problems.map((p) =>
          <div key={p.id}>{p.type}</div>
        )
      }
    </div>;
  }
}

export { Page_test };
