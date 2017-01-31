import React from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux';
import { rootReducer } from './rootReducer.js';


const store = createStore(rootReducer, window.devToolsExtension && window.devToolsExtension());

import { Provider } from 'react-redux';

import { Router, Route, browserHistory } from 'react-router';

import { CoursesPage } from './pages/courses';
import { CourseWithProblemsPage } from './pages/courseWithProblems';
import { Page_courses_new } from './pages/courses_new';
import { EditCoursePage } from './pages/editCourse';
import { ProfilePage } from './pages/profile';
import { RootPage } from './pages/root';

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="courses"          component={CoursesPage}/>
      <Route path="courses/new"      component={Page_courses_new}/>
      <Route path="courses/:id"      component={CourseWithProblemsPage}/>
      <Route path="courses/:id/edit" component={EditCoursePage}/>

      <Route path="profile" component={ProfilePage}/>

      <Route path="/" component={RootPage}/>
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);
