import knex from '~/db/knex';

const announceNewFeature = async (request, response) => {
  const type = request.body['type'];
  const content = request.body['content'];

  const users = await knex('user');

  await knex.transaction((trx) =>
    Promise.all(users.map((user) =>
      trx()
        .insert({ type, content, ifRead: false, userId: user.id })
        .into('notification')
    ))
  );

  response.success({ message: `${users.length} users are notified!` });
};


export default announceNewFeature;
