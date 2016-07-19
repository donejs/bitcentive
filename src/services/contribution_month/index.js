'use strict';

const service = require('feathers-mongoose');
const contributionMonth = require('./contribution_month-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: contributionMonth,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/api/contribution_months', service(options));

  // Get our initialize service to that we can bind hooks
  const contributionMonthService = app.service('/api/contribution_months');

  // Set up our before hooks
  contributionMonthService.before(hooks.before);

  // Set up our after hooks
  contributionMonthService.after(hooks.after);
};
