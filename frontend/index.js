import React from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux';
import { rootReducer } from './rootReducer.js';


const store = createStore(rootReducer, window.devToolsExtension && window.devToolsExtension());

import { Provider } from 'react-redux';

import { Router, Route, browserHistory } from 'react-router';

import { CoursesPage } from './pages/courses';
import { Page_courses_solve } from './pages/courses_solve';
import { ProfilePage } from './pages/profile';
import { RootPage } from './pages/root';

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="courses"          component={CoursesPage}/>
      <Route path="courses/:id"      component={Page_courses_solve}/>

      <Route path="profile" component={ProfilePage}/>

      <Route path="/" component={RootPage}/>
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);
