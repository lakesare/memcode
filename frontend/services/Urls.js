
const courses = () => '/courses';

const myCourses = () => '/courses/learning';

const courseShow = (id) => `/courses/${id}`;
const courseLearn = (id) => `/courses/${id}/learn`;
const courseReview = (id) => `/courses/${id}/review`;
const courseReviewSimulated = (id) => `/courses/${id}/review/simulated`;
const courseReviewPersistent = (id) => `/courses/${id}/review/persistent`;

export default {
  courses,
  myCourses,
  courseShow, courseLearn, courseReview, courseReviewSimulated, courseReviewAll
};
