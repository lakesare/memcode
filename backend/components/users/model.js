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
  createFrom: (oauthProvider, oauthProfile) => {
    switch (oauthProvider) {
      case 'github':
        return insert.create({
          oauthProvider: 'github',
          oauthId: oauthProfile.id.toString(),
          username: oauthProfile.login,
          avatarUrl: oauthProfile.avatar_url,
          email: oauthProfile.email
        });
      case 'google':
        return insert.create({
          oauthProvider: 'google',
          oauthId: oauthProfile.id.toString(),
          username: oauthProfile.name,
          avatarUrl: oauthProfile.picture,
          email: oauthProfile.email
        });
      default:
        throw new Error(`No such oauthProvider as '${oauthProvider}'.`);
    }
  },

  create: (user) =>
    db.one(
      'INSERT INTO "user" (oauth_provider, oauth_id, username, avatar_url, email) VALUES (${oauthProvider}, ${oauthId}, ${username}, ${avatarUrl}, ${email}) RETURNING *',
      {
        oauthProvider: user.oauthProvider,
        oauthId: user.oauthId,
        username: user.username,
        avatarUrl: user.avatarUrl,
        email: user.email
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
