import { db } from '~/db/init.js';

const select = {
  // getUserByOauth('github', 7578559)
  // => user
  oneByOauth: (oauthProvider, oauthId) =>
    db.oneOrNone(
      'SELECT * FROM "user" where oauth_provider=${oauthProvider} and oauth_id=${oauthId}',
      {
        oauthProvider,
        oauthId: oauthId.toString()
      }
    )
};

const insert = {
  createFromGithub: (profile) =>
    db.one(
      'INSERT INTO "user" (oauth_provider, oauth_id, username, avatar_url) VALUES (${oauthProvider}, ${oauthId}, ${username}, ${avatarUrl}) RETURNING *',
      {
        oauthProvider: 'github',
        oauthId: profile.id.toString(),
        username: profile.login,
        avatarUrl: profile.avatar_url
      }
    )
};

export { select, insert };
