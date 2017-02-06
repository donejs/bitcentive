'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const makeFirstAdmin = require('./make-first-admin');

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [makeFirstAdmin()],
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
