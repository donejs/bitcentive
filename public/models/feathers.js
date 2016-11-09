import feathers from 'feathers/client';
import socketio from 'feathers-socketio-ssr';
import io from 'steal-socket.io';
import auth from 'feathers-authentication/client';
import hooks from 'feathers-hooks';

var socket = io('http://localhost:3030', {
  transports: ['websocket']
});

const app = feathers()
  .configure(socketio(socket))
  .configure(hooks())
  .configure(auth());

export default app;

