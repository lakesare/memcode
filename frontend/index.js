// for googlebot and other browsers not to choke on draftjs
import 'es5-shim';
import 'es6-shim';
// `fetch` polyfill for safari
import 'whatwg-fetch';
// `URLSearchParams` polyfill for parsing query params
import 'url-search-params-polyfill';

// globally setting up quill text editor
import '~/services/quill/registerBlots';
import '~/services/quill/registerModules';

import ReactDOM from 'react-dom';

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { RootReducer } from './RootReducer.js';

const store = createStore(
  RootReducer,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ?
      window.devToolsExtension() :
      f => f
  )
);

import { Provider } from 'react-redux';
import { GatewayProvider, GatewayDest } from 'react-gateway';

import { Router, Route, browserHistory } from 'react-router';

import { Page_courses } from './pages/courses';
import { Page_courses_new } from './pages/courses_new';
import { Page_courses_id } from './pages/courses_id';
import { Page_courses_id_review } from './pages/courses_id_review';
import { Page_courses_id_learn } from './pages/courses_id_learn';
import { Page_courses_id_edit } from './pages/courses_id_edit';
import { Page_profile_learning } from './pages/profile_learning';
import { Page_profile_created } from './pages/profile_created';

// static pages
import { Page_test } from './pages/test';
import { Page_pleaseSignIn } from './pages/pleaseSignIn';
import { Page_articles_comparison } from './pages/articles_comparison';
import { Page_articles_welcome } from './pages/articles_welcome';
import { Page_contact } from './pages/contact';
// common css
import './index.css';
import './fonts/font-awesome/scss/font-awesome.scss';

const auth = {
  onEnter: (nextState, transition, callback) => {
    if (!store.getState().global.Authentication.currentUser) {
      transition({ pathname: '/please-sign-in' });
    }
    callback();
  }
};

const rootRedirect = {
  onEnter: (nextState, transition, callback) => {
    if (store.getState().global.Authentication.currentUser) {
      transition({ pathname: '/profile/learning' });
    }
    callback();
  }
};

// ___why?
//    I want every page to remount when route changes, even when only :dynamic-segment chenges.
// ___where is this solution taken from?
//    https://stackoverflow.com/a/32961482/3192470
const createElement = (Component, props) =>
  // eslint-disable-next-line react/prop-types
  <Component key={props.params.id} {...props}/>;

ReactDOM.render(
  <GatewayProvider>
    <Provider store={store}>
      <div>
        <Router history={browserHistory} createElement={createElement}>
          <Route path="/courses"          component={Page_courses}/>
          <Route path="/profile/learning" component={Page_profile_learning} {...auth}/>
          <Route path="/profile/created"  component={Page_profile_created} {...auth}/>

          <Route path="/courses/new"        component={Page_courses_new} {...auth}/>
          <Route path="/courses/:id"        component={Page_courses_id}/>
          <Route path="/courses/:id/edit"   component={Page_courses_id_edit} {...auth}/>
          <Route path="/courses/:id/learn"  component={Page_courses_id_learn} {...auth}/>
          <Route path="/courses/:id/review" component={Page_courses_id_review} simulated={false} {...auth}/>
          <Route path="/courses/:id/review/simulated" component={Page_courses_id_review} simulated/>

          {/* static pages */}
          <Route path="/please-sign-in" component={Page_pleaseSignIn}/>
          <Route path="/contact" component={Page_contact}/>
          <Route path="/test" component={Page_test}/>

          {/* articles */}
          <Route path="/" component={Page_articles_welcome} {...rootRedirect}/>
          <Route path="/articles/comparison" component={Page_articles_comparison}/>
          <Route path="/articles/welcome" component={Page_articles_welcome}/>
        </Router>
        <GatewayDest name="main"/>
      </div>
    </Provider>
  </GatewayProvider>,
  document.getElementById('root')
);
