import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import onEnters from '~/services/onEnters';

import Page_courses from './pages/courses';
import Page_courses_new from './pages/courses_new';
import Page_courses_id_review_print from './pages/courses_id_review_print';
import Page_courses_id_all_print from './pages/courses_id_all_print';
import Page_courses_id_review from './pages/courses_id_review';
import Page_courses_id_learn from './pages/courses_id_learn';
import Page_courses_id from './pages/courses_id';
import Page_courses_learning from './pages/courses_learning';

import Page_profile from './pages/profile';
import Page_users_id from './pages/users_id';

// import Page_offline_courses from './pages/offline_courses';
// import Page_offline_courses_id_review from './pages/offline_courses_id_review';

// static pages
import Page_test from './pages/test';
import Page_pleaseSignIn from './pages/pleaseSignIn';
import Page_articles_comparison from './pages/articles_comparison';
import Page_articles_welcome from './pages/articles_welcome';
import Page_contact from './pages/contact';
import Page_home from './pages/home';

import Page_admin_notifications from './pages/admin_notifications';

const auth = onEnters.requireAuthentication;

const router =
  <BrowserRouter>
    <Switch>
      <Route exact path="/courses"            component={Page_courses}/>
      <Route exact path="/courses/learning"   component={auth(Page_courses_learning)}/>
      <Route exact path="/courses/new"        component={auth(Page_courses_new)}/>
      <Route exact path="/courses/:id"        component={Page_courses_id}/>
      <Route exact path="/courses/:id/learn"  component={auth(Page_courses_id_learn)}/>
      <Route exact path="/courses/:id/review" component={auth(Page_courses_id_review)} simulated={false} persistent={false}/>
      <Route exact path="/courses/:id/review/print" component={auth(Page_courses_id_review_print)}/>
      <Route exact path="/courses/:id/all/print" component={auth(Page_courses_id_all_print)}/>
      <Route exact path="/courses/:id/review/simulated" component={(props) => <Page_courses_id_review {...props} simulated/>}/>
      <Route exact path="/courses/:id/review/persistent" component={(props) => <Page_courses_id_review {...props} persistent/>}/>

      <Route exact path="/profile" component={Page_profile}/>
      <Route exact path="/users/:id" component={Page_users_id}/>
      <Route exact path="/home" component={Page_home}/>

      {/* offline */}
      {/* <Route exact path="/offline/courses" component={Page_offline_courses} onEnter={onEnters.requireAuthentication}/> */}
      {/* <Route exact path="/offline/courses/:id/review" component={Page_offline_courses_id_review} onEnter={onEnters.requireAuthentication}/> */}

      {/* static pages */}
      <Route exact path="/please-sign-in" component={Page_pleaseSignIn}/>
      <Route exact path="/contact"        component={Page_contact}/>
      <Route exact path="/test"           component={Page_test}/>

      {/* articles */}
      <Route exact path="/"                    component={onEnters.redirectToOwnCoursesIfAuthenticated(Page_articles_welcome)}/>
      <Route exact path="/articles/comparison" component={Page_articles_comparison}/>
      <Route exact path="/articles/welcome"    component={Page_articles_welcome}/>

      {/* admin */}
      <Route exact path="/admin/notifications" component={onEnters.requireAdmin(Page_admin_notifications)}/>
    </Switch>
  </BrowserRouter>;

export default router;
