import React from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux';
import { rootReducer } from './rootReducer.js';


const store = createStore(rootReducer, window.devToolsExtension && window.devToolsExtension());


import { Provider } from 'react-redux';

// TODO how to import ReactRouter and use it as <ReactRouter.Router>?
import { Router, Route, Link, browserHistory } from 'react-router'

import { CoursesPage } from './pages/courses';
import { CourseWithProblemsPage } from './pages/courseWithProblems';
import { NewCoursePage } from './pages/newCourse';
import { EditCoursePage } from './pages/editCourse';
import { ProfilePage } from './pages/profile';


ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='courses' component={CoursesPage}/>
      <Route path='courses/new' component={NewCoursePage}/>
      <Route path='courses/:id' component={CourseWithProblemsPage}/>
      <Route path='courses/:id/edit' component={EditCoursePage}/>

      <Route path='profile' component={ProfilePage}/>
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);
