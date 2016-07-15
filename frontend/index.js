import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';


// TODO how to import ReactRouter and use it as <ReactRouter.Router>?
import { Router, Route, Link, browserHistory } from 'react-router'

import { Hello }    from './components/todos/components/list';
import { Header }   from './components/header/components/index';
import { Problem } from './components/problems/components/problem';


import { createStore } from 'redux';
import { rootReducer } from './rootReducer.js';



const initialState = {
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


class Todos extends React.Component {
  render() {
    return(
      <section>
        <Header/>
        <Hello/>
      </section>
    )
  }
};


const ProblemsPage = React.createClass({
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  },

  render() {

    return(
      <section>
        <Header/>
        <h1>Problems</h1>
        <Problem store={store} problem={store.getState().problems[0]} answers={store.getState().answers}/>
      </section>
    )
  }
});


ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path='todos' component={Todos}/>
      <Route path='problems' component={ProblemsPage}/>
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);
