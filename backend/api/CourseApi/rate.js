import CourseRatingModel from '~/models/CourseRatingModel';

const _getRatingsAndAverageAndOwn = async (courseId, currentUserId) => {
  const ratings = await CourseRatingModel.select.anyByCourse({
    courseId
  });

  const amountOfRatings = ratings.length;

  let averageRating;
  if (amountOfRatings > 0) {
    const sumOfAllRatings = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    const aveRating = sumOfAllRatings / amountOfRatings;
    averageRating = parseFloat(aveRating.toFixed(2));
  } else {
    averageRating = null;
  }

  let ownRating;
  if (currentUserId) {
    const rating = await CourseRatingModel.select.oneOrNoneByUserAndCourse({
      userId: currentUserId,
      courseId
    });
    ownRating = rating ? rating.rating : null;
  } else {
    ownRating = null;
  }

  return {
    ratings,
    averageRating,
    ownRating
  };
};


const rate = async (request, response) => {
  const userId = request.currentUser.id;
  const courseId = request.params.id;
  const rating = request.body['rating'];

  const existingRating = await CourseRatingModel.select.oneOrNoneByUserAndCourse({
    userId,
    courseId
  });

  // const existingRating = CourseRatingByUser.where({ userId, courseId })[0];
  // knex('CourseRatingByUser').where({ userId, courseId })[0]

  if (existingRating) {
    await CourseRatingModel.update.rate({ id: existingRating.id, rating });
  } else {
    await CourseRatingModel.insert.rate({ userId, courseId, rating });
  }

  const obj = await _getRatingsAndAverageAndOwn(courseId, userId);

  response.success(obj);
};

export default rate;
