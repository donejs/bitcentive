'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;
const roles = require('../../../lib/roles');

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};

const accessLists = {
  find:{},
  get:{}
};
accessLists.find[roles.admin] = "*";
accessLists.find[roles.contributor] = ["read"];
accessLists.get[roles.admin] = "*";
accessLists.get[roles.contributor] = ["read"];


exports.after = {
  all: [hooks.remove('__v')],
  find: [
    globalHooks.roleAuth.accessList.find(accessLists.find)
  ],
  get: [
    globalHooks.roleAuth.accessList.get(accessLists.get)
  ],
  create: [
    globalHooks.roleAuth.accessList.get(accessLists.get)
  ],
  update: [
    globalHooks.roleAuth.accessList.get(accessLists.get)
  ],
  patch: [
    globalHooks.roleAuth.accessList.get(accessLists.get)
  ],
  remove: [
    globalHooks.roleAuth.accessList.get(accessLists.get)
  ]
};
