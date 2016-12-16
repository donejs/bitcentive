'use strict';

const service = require('feathers-mongoose');
const contribution = require('./contribution-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: contribution,
    lean: true
  };

  // Initialize our service with any options it requires
  app.use('/api/contributions', service(options));

  // Get our initialize service to that we can bind hooks
  const contributionService = app.service('/api/contributions');

  // Set up our before hooks
  contributionService.before(hooks.before);

  // Set up our after hooks
  contributionService.after(hooks.after);
};
