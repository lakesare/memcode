import { Route, Routes, Navigate } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import onEnters from '~/services/onEnters';

import Page_courses from './pages/courses';
import Page_courses_id_review_print from './pages/courses_id_review_print';
import Page_courses_id_all_print from './pages/courses_id_all_print';
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

const auth = onEnters.requireAuthentication;

// these were evaluated once at module load under react-router 5 too, so auth state
// is still snapshotted at boot - behaviour preserved deliberately
const Learn = auth(Page_courses_id_learn);
const Review = auth(Page_courses_id_review);
const ReviewPrint = auth(Page_courses_id_review_print);
const AllPrint = auth(Page_courses_id_all_print);
const UsersId = onEnters.signIn(Page_users_id);
const Welcome = onEnters.redirectToOwnCoursesIfAuthenticated(Page_articles_welcome);
const AdminStats = onEnters.requireAdmin(Page_admin_stats);
const AdminNotifications = onEnters.requireAdmin(Page_admin_notifications);
const AdminUsers = onEnters.requireAdmin(Page_admin_users);

const router =
  <BrowserRouter>
    <Routes>
      <Route path="/courses"            element={<Page_courses/>}/>
      <Route path="/courses/new"        element={<Navigate to="/courses" replace/>}/>
      <Route path="/courses/:id"        element={<Page_courses_id/>}/>
      <Route path="/courses/:id/learn"  element={<Learn/>}/>
      <Route path="/courses/:id/review" element={<Review simulated={false} persistent={false}/>}/>
      <Route path="/courses/:id/review/print" element={<ReviewPrint/>}/>
      <Route path="/courses/:id/all/print" element={<AllPrint/>}/>
      <Route path="/courses/:id/review/simulated" element={<Page_courses_id_review simulated/>}/>
      <Route path="/courses/:id/review/persistent" element={<Page_courses_id_review persistent/>}/>

      {/* demo route */}
      <Route path="/demo" element={<Navigate to="/courses/32019/review/simulated" replace/>}/>

      <Route path="/users/:id" element={<UsersId/>}/>
      <Route path="/home" element={<Page_home/>}/>

      {/* static pages */}
      <Route path="/please-sign-in" element={<Page_pleaseSignIn/>}/>
      <Route path="/contact"        element={<Page_contact/>}/>
      <Route path="/privacy"        element={<Page_privacy/>}/>

      {/* articles */}
      <Route path="/"                    element={<Welcome/>}/>
      <Route path="/articles/comparison" element={<Page_articles_comparison/>}/>
      <Route path="/articles/welcome"    element={<Page_articles_welcome/>}/>

      {/* admin */}
      <Route path="/admin" element={<AdminStats/>}/>
      <Route path="/admin/notifications" element={<AdminNotifications/>}/>
      <Route path="/admin/users" element={<AdminUsers/>}/>

      {/* Catch-all route - redirect any unmatched routes to /courses */}
      <Route path="*" element={<Navigate to="/courses" replace/>}/>
    </Routes>
  </BrowserRouter>;

export default router;
