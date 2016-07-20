'use strict';

const service = require('feathers-mongoose');
const osProject = require('./os_project-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: osProject,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/api/os_projects', service(options));

  // Get our initialize service to that we can bind hooks
  const osProjectService = app.service('/api/os_projects');

  // Set up our before hooks
  osProjectService.before(hooks.before);

  // Set up our after hooks
  osProjectService.after(hooks.after);
};
