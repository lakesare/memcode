import { expect } from 'chai';
import supertest from 'supertest';
import nock from 'nock';

import '~/../env.js';

import { routes } from '~/routes';
import { db } from '~/db/init';
import * as User from '~/components/users/model';

nock('https://github.com')
  .post('/login/oauth/access_token')
  .reply(200, {
    access_token: 111111
  });

nock('https://api.github.com')
  .get('/user')
  .reply(200, {
    login: "octocat",
    id: 1,
    avatar_url: "https://github.com/images/error/octocat_happy.gif",
    gravatar_id: "",
    url: "https://api.github.com/users/octocat",
    html_url: "https://github.com/octocat",
    followers_url: "https://api.github.com/users/octocat/followers",
    following_url: "https://api.github.com/users/octocat/following{/other_user}",
    gists_url: "https://api.github.com/users/octocat/gists{/gist_id}",
    starred_url: "https://api.github.com/users/octocat/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/octocat/subscriptions",
    organizations_url: "https://api.github.com/users/octocat/orgs",
    repos_url: "https://api.github.com/users/octocat/repos",
    events_url: "https://api.github.com/users/octocat/events{/privacy}",
    received_events_url: "https://api.github.com/users/octocat/received_events",
    type: "User",
    site_admin: false,
    name: "monalisa octocat",
    company: "GitHub",
    blog: "https://github.com/blog",
    location: "San Francisco",
    email: "octocat@github.com",
    hireable: false,
    bio: "There once was...",
    public_repos: 2,
    public_gists: 1,
    followers: 20,
    following: 0,
    created_at: "2008-01-14T04:33:35Z",
    updated_at: "2008-01-14T04:33:35Z",
    total_private_repos: 100,
    owned_private_repos: 100,
    private_gists: 81,
    disk_usage: 10000,
    collaborators: 8,
    two_factor_authentication: true,
    plan: {
      name: "Medium",
      space: 400,
      private_repos: 20,
      collaborators: 0
    }
  });

describe('/api/auth', () => {
  beforeEach('truncating db', async () =>
    db.none('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE')
  );

  it('/github/callback - created a new user', (done) => {
    supertest(routes)
      .get('/api/auth/github/callback')
      .query({
        code: '74832748932748923789'
      })
      .expect(302)
      .end(async (error, response) => {
        expect(response.header['location']).to.include('/?token=');

        // a new user was created
        const createdUser = await User.select.one(1);
        expect(createdUser).to.deep.equal({
          id: 1,
          username: 'octocat',
          email: 'octocat@github.com',
          oauthProvider: 'github',
          oauthId: '1',
          avatarUrl: 'https://github.com/images/error/octocat_happy.gif'
        });

        error ? done(error) : done();
      });
  });
});
