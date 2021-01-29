
const courses = () => '/courses';

const myCourses = () => '/courses/learning';

const courseShow = (id) => `/courses/${id}`;
const courseLearn = (id) => `/courses/${id}/learn`;
const courseReview = (id) => `/courses/${id}/review`;
const courseReviewSimulated = (id) => `/courses/${id}/review/simulated`;

export default {
  courses,
  myCourses,
  courseShow, courseLearn, courseReview, courseReviewSimulated
};
