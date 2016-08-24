'use strict';


const contributor = require('./contributor');


const osProject = require('./os_project');
const contributionMonth = require('./contribution_month');
const clientProject = require('./client_project');
const authentication = require('./authentication');
const user = require('./user');
const contribution = require('./contribution');
const mongoose = require('mongoose');

module.exports = function() {
  const app = this;

  mongoose.connect(app.get('mongodb'));
  mongoose.Promise = global.Promise;

  app.configure(authentication);
  app.configure(user);
  app.configure(contribution);
  app.configure(clientProject);
  app.configure(contributionMonth);
  app.configure(osProject);
  app.configure(contributor);
};
