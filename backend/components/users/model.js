import { db } from '../../db/init.js';

// getUserByOauth('github', 7578559)
// => user
const getUserByOauth = (oauthProvider, oauthId) => {
  return db.oneOrNone(
    "select * from users where oauth_provider=${oauthProvider} and oauth_id=${oauthId}",
    { oauthProvider, oauthId }
  )
};

const createUserFromGithub = (profile) => {
  return db.none(
    "insert into users (oauth_provider, oauth_id, username) values (${oauthProvider}, ${oauthId}, ${username})", {
      oauthProvider: 'github',
      oauthId: profile.id,
      username: profile.username,
    }
  )
};


export { getUserByOauth, createUserFromGithub };