'use strict';

const service = require('feathers-mongoose');
const contributor = require('./contributor-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: contributor,
    lean: true,
    paginate: {
      default: 40,
      max: 200
    }
  };

  // Initialize our service with any options it requires
  app.use('/api/contributors', service(options));

  // Get our initialize service to that we can bind hooks
  const contributorService = app.service('/api/contributors');

  // Set up our before hooks
  contributorService.before(hooks.before);

  // Set up our after hooks
  contributorService.after(hooks.after);
};
