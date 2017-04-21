import React from 'react';

// import { Draft } from './components/Draft';
import { Problem } from '~/components/Problem';

import { commonFetch } from '~/api/commonFetch';
window.onerror = function (message, url, lineNo, colNo, error) {

   console.log(arguments);

   let container = document.createElement('div');

   container.style.color = 'red';
   container.style.position = 'fixed';
   container.style.background = '#eee';
   container.style.padding = '2em';
   container.style.top = '1em';
   container.style.left = '1em';

   let msg = document.createElement('pre');
   msg.innerText = [
      'Message: ' + message,
      'URL: ' + url,
      'Line: ' + lineNo,
      'Column: ' + colNo,
      'Stack: ' + (error && error.stack)
   ].join('\n');

   container.appendChild(msg);

   document.body.appendChild(container);
};

window.addEventListener("unhandledrejection", function(err, promise) { 
    // handle error here, for example log   

    console.log(err)

    let container = document.createElement('div');

    container.style.color = 'blue';
    container.style.position = 'fixed';
    container.style.background = '#eee';
    container.style.padding = '2em';
    container.style.top = '1em';
    container.style.left = '1em';

    let msg = document.createElement('pre');
    msg.innerText = [
      err.reason.message,
      JSON.stringify(err.reason.stack)
    ].join('\n');

    container.appendChild(msg);

    document.body.appendChild(container);
});


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
        <Problem
          mode="viewing"
          problemContent={problems[0]}
          problemType={problems[0].type}
        />
      }
    </div>;


  }
}

export { Page_test };


// simple draft - okay
// simple fetch /api/pages/courses/5 - okay


