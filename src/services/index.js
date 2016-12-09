'use strict';

const mongoose = require('mongoose');
const authentication = require('./authentication');
const clientProject = require('./client_project');
const contribution = require('./contribution');
const contributionMonth = require('./contribution_month');
const contributor = require('./contributor');
const osProject = require('./os_project');
const user = require('./user');

module.exports = function() {
  const app = this;

  if (process.env.TESTING !== 'true'){
    mongoose.connect(app.get('mongodb'));
  }
  mongoose.Promise = global.Promise;

  app.configure(authentication);
  app.configure(clientProject);
  app.configure(contribution);
  app.configure(contributionMonth);
  app.configure(contributor);
  app.configure(osProject);
  app.configure(user);
};
