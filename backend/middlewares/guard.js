import knex from '~/db/knex';
import auth from '~/middlewares/auth';

const guard = (getOurGuardData) => (body) => auth(guardInsides(getOurGuardData)(body));

const guardInsides = (getOurGuardData) => (callback) => async (request, response, next) => {
  const [how, id] = getOurGuardData(request);

  switch (how) {
    case 'byPuilId': {
      const puil = (await knex('problemUserIsLearning').where({ id }))[0];
      const cuil = (await knex('courseUserIsLearning').where({ id: puil.courseUserIsLearningId }))[0];
      if (cuil.userId === request.currentUser.id) {
        callback(request, response, next);
      } else {
        next(new Error("Didn't pass guard."));
      }
    }
  }
};

export default guard;
