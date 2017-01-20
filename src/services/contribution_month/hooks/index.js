'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const validateRequestData = require('./validate-request-data');

exports.before = {
  all: [
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
