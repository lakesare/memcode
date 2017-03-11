import React from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux';
import { rootReducer } from './rootReducer.js';


const store = createStore(rootReducer, window.devToolsExtension && window.devToolsExtension());

import { Provider } from 'react-redux';

import { Router, Route, browserHistory } from 'react-router';

import { Page_courses } from './pages/courses';
import { Page_courses_new } from './pages/courses_new';
import { Page_courses_id_solve } from './pages/courses_id_solve';
import { Page_courses_id_edit } from './pages/courses_id_edit';
// import { ProfilePage } from './pages/profile';
import { RootPage } from './pages/root';
import { Page_test } from './pages/test';

// common css
import './index.css';

import './fonts/font-awesome/scss/font-awesome.scss';

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="courses"          component={Page_courses}/>
      <Route path="courses/new"      component={Page_courses_new}/>
      <Route path="courses/:id"      component={Page_courses_id_solve}/>
      <Route path="courses/:id/edit" component={Page_courses_id_edit}/>

      <Route path="/test" component={Page_test}/>

      <Route path="/" component={RootPage}/>
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);
