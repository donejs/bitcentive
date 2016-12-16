'use strict';

const path = require('path');
const serveStatic = require('feathers').static;
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const socketio = require('feathers-socketio');
const middleware = require('./middleware');
const services = require('./services');
//const ssr = require("../public/ssr");

const app = feathers();

// Redirect to HTTPS if a request comes in over HTTP.
// app.get('*', function(req, res, next) {
//   if(req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
//     return res.redirect(`https://${req.hostname}${req.url}`);
//   }
//   return next();
// });

app.configure(configuration(path.join(__dirname, '..')));

app.use(compress())
  .options('*', cors())
  .use(cors())
  .use(favicon( path.join(app.get('public'), 'favicon.ico') ))
  .use('/', serveStatic( app.get('public') ))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  .configure(socketio())
  .configure(services)
  //.use(ssr)
  .configure(middleware);

module.exports = app;
