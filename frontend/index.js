import React from 'react';
import ReactDOM from 'react-dom';

import { Hello } from './todos/components/list';

import { Router, Route, Link, browserHistory } from 'react-router'



ReactDOM.render(

  <Router history={browserHistory}>
    <Route path="todos" component={Hello}/>
  </Router>


  ,
  document.getElementById('root')
);
