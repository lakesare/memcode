import jwtToUserObject from '~/services/jwtToUserObject';
import MyModel from '~/models/MyModel';
import storage from './storage';

// [claude comment] each function rebuilds what the api endpoint of the same name would return, out of what the offline download saved - undefined if the download doesn't have it
const getMeta = async () => {
  const meta = await storage.getResponse('meta');
  const currentUser = jwtToUserObject(localStorage.getItem('jwt'));
  return (meta && currentUser && meta.userId === currentUser.id) ? meta : undefined;
};

const getSaved = async (key) =>
  (await getMeta()) ? storage.getResponse(key) : undefined;

const getMyEverything = () => getSaved('getMyEverything');
const getAllCategories = () => getSaved('getAllCategories');
const getForCourseActions = (courseId) => getSaved(`getForCourseActions:${courseId}`);
const getLearnPage = (courseId) => getSaved(`getLearnPage:${courseId}`);

const getUserPage = async (userId) => {
  const meta = await getMeta();
  return (meta && meta.userId === parseInt(userId)) ? storage.getResponse('getUserPage') : undefined;
};

const getCoursePage = async (courseId) => {
  const learnPage = await getLearnPage(courseId);
  return learnPage ?
    { problems: learnPage.problems, problemUserIsLearnings: learnPage.problemUserIsLearnings, ifLearningCourse: true } :
    undefined;
};

const getReviewSimulatedPage = async (courseId) => {
  const learnPage = await getLearnPage(courseId);
  return learnPage ?
    { courseUserIsLearning: null, problems: learnPage.problems } :
    undefined;
};

const getReviewPageWith = async (courseId, selectProblems) => {
  const learnPage = await getLearnPage(courseId);
  const dtos = await getMyEverything();
  const dto = dtos && dtos.find((someDto) => someDto.course.id === courseId);

  if (learnPage && dto) {
    const selectedIds = new Set(selectProblems(dto).map((problem) => problem.id));
    return {
      courseUserIsLearning: learnPage.courseUserIsLearning,
      problems: learnPage.problems.filter((problem) => selectedIds.has(problem.id))
    };
  } else {
    return undefined;
  }
};

const getReviewPage = (courseId) =>
  getReviewPageWith(courseId, MyModel.getProblemsToReview);

const getReviewPersistentPage = (courseId) =>
  getReviewPageWith(courseId, MyModel.getLearnedProblems);

const getReviewFailedPage = (courseId, problemIds) =>
  getReviewPageWith(courseId, (dto) =>
    MyModel.getLearnedProblems(dto).filter((problem) => problemIds.includes(problem.id))
  );

export default {
  getMeta,
  getMyEverything, getAllCategories, getForCourseActions, getUserPage,
  getCoursePage, getLearnPage,
  getReviewPage, getReviewSimulatedPage, getReviewPersistentPage, getReviewFailedPage
};
