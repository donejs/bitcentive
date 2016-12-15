'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-legacy-authentication-hooks');

exports.before = {
  all: [
    auth.restrictToAuthenticated(),
    // auth.checkPermissions({namespace: 'users', on: 'user', field: 'permissions'}),
    // auth.isPermitted()
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
