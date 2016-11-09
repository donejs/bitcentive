'use strict';

const authentication = require('feathers-authentication');
const token = authentication.TokenService;
const githubAuth = require('feathers-authentication-popups-github');

module.exports = function () {
  const app = this;

  var config = app.get('auth');

  app.configure(authentication(config))
    .configure(token(config.token))
    .configure(githubAuth(config.github, config.cookie));
};
