import React from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux';
import { rootReducer } from './rootReducer.js';



let initialState = {
	problems: [
    {
      id: 1,
      explanation: 'some context to a problem',
      answerIds: [1, 2]
    }
  ],
  answers: [
    {
      id: 1,
      precedingText: 'first answer is',
      answer: 'hi',
      answered: null //'right', 'wrong', null
    },
    {
      id: 2,
      precedingText: 'second answer is',
      answer: 'hello',
      answered: null //'right', 'wrong', null
    }
  ]

};

const store = createStore(rootReducer, initialState);


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
