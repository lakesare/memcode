import db from '~/db/init.js';

const select = {
  // getUserByOauth('github', 7578559)
  // => user
  oneByOauth: (oauthProvider, oauthId) =>
    db.oneOrNone(
      'SELECT * FROM "user" WHERE oauth_provider=${oauthProvider} and oauth_id=${oauthId}',
      {
        oauthProvider,
        oauthId: oauthId.toString()
      }
    ),

  one: (id) =>
    db.one(
      `SELECT * FROM "user" WHERE id = \${id}`,
      { id }
    )
};

export { select };
