import auth from '~/middlewares/auth';

const getPublicCourses = auth(async (request, response) => {
  // (does work!)
  // throw new Error('Hi');
  // (does work!)
  // await Promise.reject('Mimosa');

  response.success({ hi: 'hello', userName: request.currentUser.username });
});

export default getPublicCourses;
