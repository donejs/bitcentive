import feathers from 'feathers/client';
import io from 'steal-socket.io';
import socketio from 'feathers-socketio/client';
import rest from 'feathers-rest/client';
import superagent from 'superagent/superagent';
import jQuery from 'jquery';
import auth from 'feathers-authentication/client';
import hooks from 'feathers-hooks';
import {CookieStorage} from 'cookie-storage';

const cookieStorage = new CookieStorage();

const serverURL = 'http://localhost:3030';

console.log('feathers model: creating socket.io connection...');
var socket = io(serverURL, {
  transports: ['websocket']
});
const app = feathers()
  .configure(socketio(socket))
  .configure(hooks())
  .configure(auth({
    // storage: cookieStorage
  }));

export default app;

