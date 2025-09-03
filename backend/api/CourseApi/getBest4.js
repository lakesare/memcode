import CourseModel from '#~/models/CourseModel/index.js'

const getBest4 = async (request, response) => {
  const courses = await CourseModel.select.allPublic({
    limit: 4,
    offset: 0,
    customWhere: 'AND course.id IN (1492, 944, 1490, 632)'
  });

  response.status(200).json({ courses });
};

export default getBest4;
