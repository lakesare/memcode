import React from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux';
import { rootReducer } from './rootReducer.js';


const store = createStore(rootReducer);


import { Provider } from 'react-redux';

// TODO how to import ReactRouter and use it as <ReactRouter.Router>?
import { Router, Route, Link, browserHistory } from 'react-router'

import { CoursesPage } from './pages/courses';
import { ProblemsPage } from './pages/problems';


ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='courses' component={CoursesPage}/>
      <Route path='courses/:id/problems' component={ProblemsPage}/>
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);
