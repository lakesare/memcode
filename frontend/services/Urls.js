
const courses = () => '/courses';

const userShow = (id) => `/users/${id}`;

const courseShow = (id) => `/courses/${id}`;
const courseLearn = (id) => `/courses/${id}/learn`;
const courseReview = (id) => `/courses/${id}/review`;
const courseReviewSimulated = (id) => `/courses/${id}/review/simulated`;
const courseReviewPersistent = (id) => `/courses/${id}/review/persistent`;

export default {
  courses,
  userShow,
  courseShow, courseLearn, courseReview, courseReviewSimulated, courseReviewPersistent
};
