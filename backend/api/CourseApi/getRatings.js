import getRatingsAndAverageAndOwn from './services/getRatingsAndAverageAndOwn.js';

const getRatings = async (request, response) => {
  const userId = request.currentUser ? request.currentUser.id : null;
  const courseId = request.body['courseId'];

  const obj = await getRatingsAndAverageAndOwn(courseId, userId);

  response.success(obj);
};

export default getRatings;
