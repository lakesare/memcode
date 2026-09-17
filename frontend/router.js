import { Route, Routes, Navigate, BrowserRouter } from 'react-router';
import {
  RequireAuth, RequireAdmin,
  RedirectToOwnCoursesIfAuthenticated, SignInFromUrlToken
} from '~/appComponents/RouteGuards';

import Page_courses from './pages/courses';
import Page_courses_id_print from './pages/courses_id_print';
import Page_courses_id_review from './pages/courses_id_review';
import Page_courses_id_learn from './pages/courses_id_learn';
import Page_courses_id from './pages/courses_id';

import Page_users_id from './pages/users_id';

// import Page_offline_courses from './pages/offline_courses';
// import Page_offline_courses_id_review from './pages/offline_courses_id_review';

// static pages
import Page_pleaseSignIn from './pages/pleaseSignIn';
import Page_articles_comparison from './pages/articles_comparison';
import Page_articles_welcome from './pages/articles_welcome';
import Page_contact from './pages/contact';
import Page_privacy from './pages/privacy';
import Page_home from './pages/home';

import Page_admin_notifications from './pages/admin_notifications';
import Page_admin_users from './pages/admin_users';
import Page_admin_stats from './pages/admin_stats';

const router =
  <BrowserRouter>
    <Routes>
      <Route path="/courses"            element={<Page_courses/>}/>
      <Route path="/courses/new"        element={<Navigate to="/courses" replace/>}/>
      <Route path="/courses/:id"        element={<Page_courses_id/>}/>
      <Route path="/courses/:id/learn"  element={<RequireAuth><Page_courses_id_learn/></RequireAuth>}/>
      <Route path="/courses/:id/review" element={<RequireAuth><Page_courses_id_review simulated={false} persistent={false}/></RequireAuth>}/>
      <Route path="/courses/:id/print" element={<RequireAuth><Page_courses_id_print kind="all"/></RequireAuth>}/>
      <Route path="/courses/:id/print-due" element={<RequireAuth><Page_courses_id_print kind="due"/></RequireAuth>}/>
      <Route path="/courses/:id/print-learned" element={<RequireAuth><Page_courses_id_print kind="learned"/></RequireAuth>}/>
      <Route path="/courses/:id/review/simulated" element={<Page_courses_id_review simulated/>}/>
      <Route path="/courses/:id/review/persistent" element={<Page_courses_id_review persistent/>}/>
      <Route path="/courses/:id/review/failed" element={<RequireAuth><Page_courses_id_review failed/></RequireAuth>}/>

      {/* demo route */}
      <Route path="/demo" element={<Navigate to="/courses/32019/review/simulated" replace/>}/>

      <Route path="/users/:id" element={<SignInFromUrlToken><Page_users_id/></SignInFromUrlToken>}/>
      <Route path="/home" element={<Page_home/>}/>

      {/* static pages */}
      <Route path="/please-sign-in" element={<Page_pleaseSignIn/>}/>
      <Route path="/contact"        element={<Page_contact/>}/>
      <Route path="/privacy"        element={<Page_privacy/>}/>

      {/* articles */}
      <Route path="/"                    element={<RedirectToOwnCoursesIfAuthenticated><Page_articles_welcome/></RedirectToOwnCoursesIfAuthenticated>}/>
      <Route path="/articles/comparison" element={<Page_articles_comparison/>}/>
      <Route path="/articles/welcome"    element={<Page_articles_welcome/>}/>

      {/* admin */}
      <Route path="/admin" element={<RequireAdmin><Page_admin_stats/></RequireAdmin>}/>
      <Route path="/admin/notifications" element={<RequireAdmin><Page_admin_notifications/></RequireAdmin>}/>
      <Route path="/admin/users" element={<RequireAdmin><Page_admin_users/></RequireAdmin>}/>

      {/* Catch-all route - redirect any unmatched routes to /courses */}
      <Route path="*" element={<Navigate to="/courses" replace/>}/>
    </Routes>
  </BrowserRouter>;

export default router;
