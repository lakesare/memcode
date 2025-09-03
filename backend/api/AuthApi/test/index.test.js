// import { expect } from 'chai';
// import supertest from 'supertest';
// // import jwt from 'jsonwebtoken';

// import '../../../../env.js';

// import routes from '#~/routes';
// import db from '#~/db/init.js';
// import UserModel from '#~/models/UserModel/index.js'
// // import { RawFactory } from '#~/test/services/Factory';

// // faking oauth requests
// import './nock/github';
// import './nock/google';

// describe('/api/auth', () => {
//   beforeEach('truncating db', async () =>
//     db.none('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE')
//   );

//   it('/github/callback - created a new user', (done) => {
//     supertest(routes)
//       .get('/api/auth/github/callback')
//       .query({
//         code: '74832748932748923789'
//       })
//       .expect(302)
//       .end(async (error, response) => {
//         expect(response.header['location']).to.include('/?token=');

//         const createdUser = await UserModel.select.one(1);
//         expect(createdUser).to.deep.include({
//           id: 1,
//           username: 'octocat',
//           email: 'octocat@github.com',
//           oauthProvider: 'github',
//           oauthId: '1',
//           avatarUrl: 'https://github.com/images/error/octocat_happy.gif'
//         });

//         error ? done(error) : done();
//       });
//   });

//   // ___NOTHING WORKS, async and done don't work together, nock can't find a route if it's used multiple times, utter chaos
//   // it('/github/callback - sign in as old user', (done) => {
//   //   mochaAsync(done, async () => {
//   //     const dbUser = await RawFactory.user({
//   //       username: 'octocat',
//   //       email: 'octocat@github.com',
//   //       oauthProvider: 'github',
//   //       oauthId: '1',
//   //       avatarUrl: 'https://github.com/images/error/octocat_happy.gif'
//   //     });
//   //     const response = await supertest(routes)
//   //       .get('/api/auth/github/callback')
//   //       .query({
//   //         code: '74832748932748923789'
//   //       })
//   //       .expect(302);

//   //     const redirectLink = response.header['location'];
//   //     expect(redirectLink).to.include('/?token=');

//   //     const token = jwt.sign(dbUser, process.env['JWT_SECRET']);
//   //     expect(redirectLink.split('/?token=')[1]).to.equal(token);
//   //   });
//   // });

//   it('/google/callback - created a new user', (done) => {
//     supertest(routes)
//       .get('/api/auth/google/callback')
//       .query({
//         code: '748327489327489266689'
//       })
//       .expect(302)
//       .end(async (error, response) => {
//         expect(response.header['location']).to.include('/?token=');

//         const createdUser = await UserModel.select.one(1);
//         expect(createdUser).to.deep.include({
//           id: 1,
//           username: 'Kjrjll Prosvvrakv',
//           email: 'kprosvvrakv@gmail.com',
//           oauthProvider: 'google',
//           oauthId: '108379790261381527443',
//           avatarUrl: 'https://lh5.googleusercontent.com/--2sNresqlmw/AAAAAAAAAAI/AAAAAAAAA5M/y1bC_4sISzg/photo.jpg'
//         });

//         error ? done(error) : done();
//       });
//   });
// });
