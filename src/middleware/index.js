'use strict';

const handler = require('feathers-errors/handler');
const notFound = require('./not-found-handler');
const logger = require('./logger');
const path = require('path');
const fs = require('fs');

module.exports = function() {
  // Add your custom middleware here. Remember, that
  // just like Express the order matters, so error
  // handling middleware should go last.
  const app = this;

  // For the root, load the html `main` file from the environment config.
  app.use('/', function (req, res, next) {
    if(req.url === "/") {
      var main = app.get('main');
      var filePath = path.join(process.cwd(), 'public', main);
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      } else {
        console.log('no environment configured for ' + process.env.NODE_ENV);
      }
    }
    return next();
  });
  app.use(notFound());
  app.use(logger(app));
  //app.use(handler());
};
