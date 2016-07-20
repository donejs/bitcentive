'use strict';

const service = require('feathers-mongoose');
const clientProject = require('./client_project-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: clientProject,
    paginate: {
      default: 25,
      max: 100
    }
  };

  // Initialize our service with any options it requires
  app.use('/api/client_projects', service(options));

  // Get our initialize service to that we can bind hooks
  const clientProjectService = app.service('/api/client_projects');

  // Set up our before hooks
  clientProjectService.before(hooks.before);

  // Set up our after hooks
  clientProjectService.after(hooks.after);
};
