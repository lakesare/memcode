import { Router, Route, browserHistory } from 'react-router';
import onEnters from '~/services/onEnters';

import Page_courses from './pages/courses';
import Page_courses_new from './pages/courses_new';
import Page_courses_id from './pages/courses_id';
import Page_courses_id_review from './pages/courses_id_review';
import Page_courses_id_learn from './pages/courses_id_learn';
import Page_courses_id_edit from './pages/courses_id_edit';
import Page_courses_learning from './pages/courses_learning';
import Page_courses_created from './pages/courses_created';

import Page_offline_courses from './pages/offline_courses';
import Page_offline_courses_id_review from './pages/offline_courses_id_review';

// static pages
import Page_test from './pages/test';
import Page_pleaseSignIn from './pages/pleaseSignIn';
import Page_articles_comparison from './pages/articles_comparison';
import Page_articles_welcome from './pages/articles_welcome';
import Page_contact from './pages/contact';

import Page_admin_notifications from './pages/admin_notifications';

// ___why?
//    I want every page to remount when route changes, even when only :dynamic-segment chenges.
// ___where is this solution taken from?
//    https://stackoverflow.com/a/32961482/3192470
const createElement = (Component, props) =>
  // eslint-disable-next-line react/prop-types
  <Component key={props.params.id} {...props}/>;

const router =
  <Router history={browserHistory} createElement={createElement}>
    <Route path="/courses"          component={Page_courses}/>
    <Route path="/courses/learning" component={Page_courses_learning} onEnter={onEnters.requireAuthentication}/>
    <Route path="/courses/created"  component={Page_courses_created}  onEnter={onEnters.requireAuthentication}/>
    <Route path="/courses/new"        component={Page_courses_new}      onEnter={onEnters.requireAuthentication}/>
    <Route path="/courses/:id"        component={Page_courses_id}/>
    <Route path="/courses/:id/edit"   component={Page_courses_id_edit}  onEnter={onEnters.requireAuthentication}/>
    <Route path="/courses/:id/learn"  component={Page_courses_id_learn} onEnter={onEnters.requireAuthentication}/>
    <Route path="/courses/:id/review" component={Page_courses_id_review} simulated={false} onEnter={onEnters.requireAuthentication}/>
    <Route path="/courses/:id/review/simulated" component={Page_courses_id_review} simulated/>

    {/* offline */}
    <Route path="/offline/courses" component={Page_offline_courses} onEnter={onEnters.requireAuthentication}/>
    <Route path="/offline/courses/:id/review" component={Page_offline_courses_id_review} onEnter={onEnters.requireAuthentication}/>

    {/* static pages */}
    <Route path="/please-sign-in" component={Page_pleaseSignIn}/>
    <Route path="/contact"        component={Page_contact}/>
    <Route path="/test"           component={Page_test}/>

    {/* articles */}
    <Route path="/"                    component={Page_articles_welcome} onEnter={onEnters.redirectToOwnCoursesIfAuthenticated}/>
    <Route path="/articles/comparison" component={Page_articles_comparison}/>
    <Route path="/articles/welcome"    component={Page_articles_welcome}/>

    {/* admin */}
    <Route path="/admin/notifications" component={Page_admin_notifications} onEnter={onEnters.requireAdmin}/>
  </Router>;

export default router;
