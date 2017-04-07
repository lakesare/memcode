import * as User from '~/components/users/model';
import * as Course from '~/components/courses/model';
import * as Problem from '~/components/problems/model';
import * as CourseUserIsLearning from '~/components/coursesUserIsLearning/model';
import * as ProblemUserIsLearning from '~/components/problemsUserIsLearning/model';

let uniqueIndex = 1;

const RawFactory = {
  user: () => {
    uniqueIndex++;
    return User.insert.createFromGithub({
      id: uniqueIndex, // oauthId, not real one. still needs to be unique
      login: 'lakesare'
    });
  },

  course: ({ userId }) =>
    Course.insert.create(
      { title: 'React' },
      userId
    ),

  problem: ({ courseId }) =>
    Problem.insert.create({
      content: {},
      courseId
    }),

  courseUserIsLearning: ({ courseId, userId }) =>
    CourseUserIsLearning.insert.create(courseId, userId),

  problemUserIsLearning: ({ problemId, courseUserIsLearningId }) =>
    ProblemUserIsLearning.insert.create(courseUserIsLearningId, problemId)
};

const Factory = {
  problemUserIsLearning: async () => {
    const user    = await RawFactory.user();
    const course  = await RawFactory.course({ userId: user.id });
    const cuil    = await RawFactory.courseUserIsLearning({ courseId: course.id, userId: user.id });
    const problem = await RawFactory.problem({ courseId: course.id });
    const puil    = await RawFactory.problemUserIsLearning({ problemId: problem.id, courseUserIsLearningId: cuil.id });
    return puil;
  }
};

export { Factory };
