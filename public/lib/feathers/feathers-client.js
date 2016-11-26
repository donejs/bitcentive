import feathers from 'feathers/client';
import io from 'steal-socket.io';
import socketio from 'feathers-socketio/client';
import auth from 'feathers-authentication/client';
import hooks from 'feathers-hooks';

var socket = io({
  transports: ['websocket']
});
const app = feathers()
  .configure(socketio(socket))
  .configure(hooks())
  .configure(auth());

export default app;
