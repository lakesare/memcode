import knex from '#~/db/knex.js';
import { mustBeAuthenticated } from '#~/services/auth.js';

const findByString = async (request, response) => {
  const searchString = request.body['searchString'];
  
  // Only authenticated users can search for other users
  await mustBeAuthenticated(request.currentUser);

  const users = await knex('user')
    .select('id', 'username', 'avatar_url', 'created_at')
    .where('username', 'ilike', `%${searchString}%`)
    .orWhere('email', 'ilike', `%${searchString}%`)
    .limit(30);

  response.success(users);
};

export default findByString;
