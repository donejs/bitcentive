'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const validateRequestData = require('./validate-request-data');

exports.before = {
  all: [
    auth.isAuthenticated(),
    // auth.checkPermissions({namespace: 'users', on: 'user', field: 'permissions'}),
    // auth.isPermitted()
    validateRequestData()
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [hooks.remove('__v')],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
