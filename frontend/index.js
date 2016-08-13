import React from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux';
import { rootReducer } from './rootReducer.js';


const store = createStore(rootReducer, window.devToolsExtension && window.devToolsExtension());


import { Provider } from 'react-redux';

// TODO how to import ReactRouter and use it as <ReactRouter.Router>?
import { Router, Route, Link, browserHistory } from 'react-router'

import { CoursesPage } from './pages/courses';
import { ProblemsPage } from './pages/problems';
import { NewCoursePage } from './pages/newCourse';


ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='courses' component={CoursesPage}/>
      <Route path='courses/new' component={NewCoursePage}/>
      <Route path='courses/:id' component={ProblemsPage}/>
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);
