'use strict';

const service = require('feathers-mongoose');
const contributor = require('./contributor-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: contributor,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/contributors', service(options));

  // Get our initialize service to that we can bind hooks
  const contributorService = app.service('/contributors');

  // Set up our before hooks
  contributorService.before(hooks.before);

  // Set up our after hooks
  contributorService.after(hooks.after);
};
