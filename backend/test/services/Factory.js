import UserModel from '#~/models/UserModel/index.js'
import CourseModel from '#~/models/CourseModel/index.js'
import ProblemModel from '#~/models/ProblemModel/index.js'
import CourseUserIsLearningModel from '#~/models/CourseUserIsLearningModel/index.js'
import ProblemUserIsLearningModel from '#~/models/ProblemUserIsLearningModel/index.js'

import { requireKeys } from '#~/services/requireKeys.js';

let uniqueIndex = 1;

const RawFactory = {
  user: (userFields) => {
    uniqueIndex++;
    return UserModel.insert.create({
      oauthProvider: 'github',
      oauthId: uniqueIndex, // oauthId, not real one. still needs to be unique
      username: 'lakesare',
      avatarUrl: 'hi.png',
      email: 'lake@gmail.com',
      ...userFields
    });
  },

  // required: userId
  course: requireKeys(['userId'],
    (courseFields) =>
      CourseModel.insert.create(
        {
          title: 'React',
          description: 'Js framework',
          ifPublic: true,
          ...courseFields
        }
      )
  ),

  problem: requireKeys(['courseId'],
    (problemFields) =>
      ProblemModel.insert.create({
        type: 'inlinedAnswers',
        content: {
          content: '2+2',
          answer: '4'
        },
        ...problemFields
      })
  ),

  courseUserIsLearning: requireKeys(['courseId', 'userId'],
    (cuilFields) =>
      CourseUserIsLearningModel.insert.create({
        active: true,
        ...cuilFields
      })
  ),

  problemUserIsLearning: requireKeys(['problemId', 'courseUserIsLearningId'],
    (puilFields) =>
      ProblemUserIsLearningModel.insert.create({
        ...puilFields
      })
  )
};

const Factory = {
  // problemUserIsLearning: async (puilFields) => {
  //   const user    = await RawFactory.user();
  //   const course  = await RawFactory.course({ userId: user.id });
  //   const cuil    = await RawFactory.courseUserIsLearning({ courseId: course.id, userId: user.id });
  //   const problem = await RawFactory.problem({ courseId: course.id });
  //   const puil    = await RawFactory.problemUserIsLearning({ problemId: problem.id, courseUserIsLearningId: cuil.id });
  //   return puil;
  // },

  course: async (courseFields) => {
    const user = await RawFactory.user({});
    const course = await RawFactory.course({
      userId: user.id,
      ...courseFields
    });
    return course;
  },

  // kind of course that gets returned in /courses
  publicCourse: async (courseFields) => {
    const user = await RawFactory.user();
    const course = await RawFactory.course({
      userId: user.id,
      ifPublic: true,
      ...courseFields
    });
    await RawFactory.problem({ courseId: course.id });
    await RawFactory.problem({ courseId: course.id });
    return course;
  }
};

export { RawFactory, Factory };
