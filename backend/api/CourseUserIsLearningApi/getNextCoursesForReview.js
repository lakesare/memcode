// import knex from '~/db/knex';
// 
// // params = { userId }
// const getNextCoursesForReview = async (request, response) => {
//   const userId = request.body.userId;
// 
//   const allNotifications = await knex('notification').where({ userId });
//   const unreadNotifications = await knex('notification').where({ userId, ifRead: false });
// 
//   response.success(courses);
// 
// 
// 
//   apiGetOwnCourses = () =>
//     CourseApi.selectAllLearned(false)
// 
//   apiGetPopularCourses = () =>
//     CourseApi.selectPublic(
//       false,
//       {
//         pageSize: 21,
//         pageNumber: 1,
//         sortBy: 'popular'
//       }
//     )
// 
//   Promise.all([
//     this.apiGetPopularCourses(),
//     (this.props.currentUser ? this.apiGetOwnCourses() : [])
//   ]).then(([popularCourses, ownCourses]) => {
//     const filteredOwnCourses = ownCourses.filter(({ course }) => course.id !== this.props.courseId);
// 
//     // um, 8 actually
//     const amountOfCoursesToShow = 20;
// 
//     let finalCourses = filteredOwnCourses
//       .slice(0, amountOfCoursesToShow)
//       .map((courseData) => ({ ...courseData, _type: 'learnReviewCourse' }));
// 
//     if (finalCourses.length < amountOfCoursesToShow) {
//       const filteredPopularCourses = popularCourses
//         .onePageOfCourses
//         .filter(({ course }) =>
//           (course.id !== this.props.courseId) &&
//           // ignore those courses which are already in filteredOwnCourses
//           !filteredOwnCourses.find((ownCourseData) => ownCourseData.course.id === course.id)
//         );
//       const neededAmountOfCourses = amountOfCoursesToShow - finalCourses.length;
// 
//       finalCourses = [
//         ...finalCourses,
//         ...filteredPopularCourses
//           .slice(0, neededAmountOfCourses)
//           .map((courseData) => ({ ...courseData, _type: 'simpleCourse' }))
//       ];
//     }
//     this.setState({ speCourses: createSpe.success(finalCourses) });
//   }).catch((error) => {
//     this.setState({ speCourses: createSpe.failure(error) });
//   });
// };
// 
// export default getNextCoursesForReview;
