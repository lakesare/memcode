import { db } from '~/db/init.js';

// getUserByOauth('github', 7578559)
// => user
const getUserByOauth = (oauthProvider, oauthId) =>
  db.oneOrNone(
    'SELECT * FROM "user" where oauth_provider=${oauthProvider} and oauth_id=${oauthId}',
    { oauthProvider, oauthId }
  );

const createUserFromGithub = (profile) =>
  db.none(
    'INSERT INTO "user" (oauth_provider, oauth_id, username) VALUES (${oauthProvider}, ${oauthId}, ${username})', {
      oauthProvider: 'github',
      oauthId: profile.id,
      username: profile.username,
    }
  );

export { getUserByOauth, createUserFromGithub };
