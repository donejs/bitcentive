'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');

exports.before = {
  all: [],
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
