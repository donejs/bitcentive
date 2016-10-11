'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const prepareGithubUser = require('./prepare-github-user');

exports.before = {
  all: [
    auth.isAuthenticated(),
    // auth.checkPermissions({namespace: 'users', on: 'user', field: 'permissions'}),
    // auth.isPermitted()
  ],
  find: [],
  get: [],
  create: [
    auth.hashPassword(),
    prepareGithubUser()
  ],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [
    hooks.remove('password','__v')
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
