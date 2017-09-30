import { db } from '~/db/init.js';

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

const insert = {
  createFromGithub: (profile) =>
    db.one(
      'INSERT INTO "user" (oauth_provider, oauth_id, username, avatar_url, email) VALUES (${oauthProvider}, ${oauthId}, ${username}, ${avatarUrl}, ${email}) RETURNING *',
      {
        oauthProvider: 'github',
        oauthId: profile.id.toString(),
        username: profile.login,
        avatarUrl: profile.avatar_url,
        email: profile.email
      }
    )
};

const update = {
  update: async (id, email) =>
    db.one(
      `
        UPDATE "user"
        SET email = \${email}
        WHERE id = \${id}
        RETURNING *
      `,
      { id, email }
    )
};

export { select, insert, update };
