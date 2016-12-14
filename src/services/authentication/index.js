'use strict';

const auth = require('feathers-authentication');
const jwt = require('feathers-authentication-jwt');
const githubAuth = require('feathers-authentication-popups-github');

module.exports = function () {
  const app = this;

  var config = app.get('auth');

  app.configure(auth(config))
    .configure(jwt())
    .configure(githubAuth(config.github, config.cookie));

  app.service('authentication').hooks({
    before: {
      create: [
        auth.hooks.authenticate('jwt')
      ]
    }
  });
};
