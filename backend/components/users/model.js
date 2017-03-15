import { db } from '~/db/init.js';

// getUserByOauth('github', 7578559)
// => user
const getUserByOauth = (oauthProvider, oauthId) =>
  db.oneOrNone(
    'SELECT * FROM "user" where oauth_provider=${oauthProvider} and oauth_id=${oauthId}',
    {
      oauthProvider,
      oauthId: oauthId.toString()
    }
  );

const createUserFromGithub = (profile) =>
  db.one(
    'INSERT INTO "user" (oauth_provider, oauth_id, username, avatar_url) VALUES (${oauthProvider}, ${oauthId}, ${username}, ${avatarUrl}) RETURNING *',
    {
      oauthProvider: 'github',
      oauthId: profile.id.toString(),
      username: profile.username,
      avatarUrl: profile.avatar_url
    }
  );

export { getUserByOauth, createUserFromGithub };
