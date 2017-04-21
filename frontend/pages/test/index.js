import React from 'react';

import { Draft } from './components/DraftKeyBindings';
import { Problem } from '~/components/Problem';

import { commonFetch } from '~/api/commonFetch';

class Page_test extends React.Component {


  render = () => {
    return <div className="container">
      <h1>Hello</h1>
      <Draft/>
    </div>;
  }
}

export { Page_test };
