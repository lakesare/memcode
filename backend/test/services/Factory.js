import * as User from '~/components/users/model';
import * as Course from '~/components/courses/model';
import * as Problem from '~/components/problems/model';
import * as CourseUserIsLearning from '~/components/coursesUserIsLearning/model';
import * as ProblemUserIsLearning from '~/components/problemsUserIsLearning/model';

import { requireKeys } from '~/services/requireKeys';

let uniqueIndex = 1;

const RawFactory = {
  user: (userFields) => {
    uniqueIndex++;
    return User.insert.create({
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
      Course.insert.create(
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
      Problem.insert.create({
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
      CourseUserIsLearning.insert.create({
        active: true,
        ...cuilFields
      })
  ),

  problemUserIsLearning: requireKeys(['problemId', 'courseUserIsLearningId'],
    (puilFields) =>
      ProblemUserIsLearning.insert.create({
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
