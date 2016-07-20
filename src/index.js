'use strict';

const app = require('./app');
const port = app.get('port');
const server = app.listen(process.env.PORT || port);
const path = require("path");
const exec = require( "child_process" ).exec;

server.on('listening', () =>
  console.log(`DoneJS and Feathers application started on ${app.get('host')}:${port}`)
);

if ( process.argv.indexOf( "--develop" ) !== -1 ) {
  //is dev mode so do live reload
  var child = exec( path.join("node_modules",".bin","steal-tools live-reload"), {
    cwd: process.cwd() + "/public"
  });

  child.stdout.pipe( process.stdout );
  child.stderr.pipe( process.stderr );
}
