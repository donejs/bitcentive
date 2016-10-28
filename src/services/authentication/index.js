'use strict';

const authentication = require('feathers-authentication');
const token = authentication.TokenService;
const local = authentication.LocalService;
const oauth2 = authentication.OAuth2Service;

const GithubStrategy = require('passport-github').Strategy;
const GithubTokenStrategy = require('passport-github-token');

const handleOAuthPopups = require('feathers-authentication-popups/middleware');

module.exports = function() {
  const app = this;

  let config = app.get('auth');

  config.github.strategy = GithubStrategy;
  config.github.tokenStrategy = GithubTokenStrategy;

  app.set('auth', config);
  app.configure(authentication(config))
    .configure(token(config.token))
    .configure(local(config.local))
    .configure(oauth2(config.github));

  app.get('/auth/success', handleOAuthPopups(app));
};
