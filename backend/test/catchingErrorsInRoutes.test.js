import { expect } from 'chai';
import supertest from 'supertest';
import express from 'express';
import catchAsync from '~/services/catchAsync';
import { handleErrors } from '~/middlewares/handleErrors';


const createAppWithRoute = (routeCallback) => {
  const app = express();
  const testRouter = express.Router();
  testRouter.get('/hello', routeCallback);

  app.use('/test', testRouter);
  app.use(handleErrors);

  return app;
};

describe('catchingErrorsInRoutes', () => {
  it('no errors => returns status and json as per route definition', (done) => {
    const app = createAppWithRoute(
      catchAsync(async (request, response) => {
        response.status(234).json({ hm: 'yes' });
      })
    );

    supertest(app)
      .get('/test/hello')
      .expect(234)
      .end((error, response) => {
        expect(response.body).to.deep.equal({ hm: 'yes' });
        error ? done(error) : done();
      });
  });

  it('sync error without catchAsync', (done) => {
    const app = createAppWithRoute(
      () => {
        throw new Error('Rrr!');
      }
    );

    supertest(app)
      .get('/test/hello')
      .expect(500, { error: 'Rrr!' }, done);
  });

  it('sync error with catchAsync', (done) => {
    const app = createAppWithRoute(
      catchAsync(async () => {
        throw new Error('Rrr!');
      })
    );

    supertest(app)
      .get('/test/hello')
      .expect(500, { error: 'Rrr!' }, done);
  });

  // ___didn't include because couldn't catch Unhandled promise rejection (rejection id: 2): Rrr!
  // it('async error without catchAsync', (done) => {})

  it('async error with catchAsync', (done) => {
    const app = createAppWithRoute(
      catchAsync(async () => {
        await Promise.reject('Sss!');
      })
    );

    supertest(app)
      .get('/test/hello')
      .expect(500, { error: 'Sss!' }, done);
  });
});
