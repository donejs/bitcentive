import feathers from 'feathers/client';
//import io from 'steal-socket.io';
import io from 'socket.io-client/dist/socket.io';
import socketio from 'feathers-socketio/client';
import auth from 'feathers-authentication-client';
import hooks from 'feathers-hooks';
import "@fixture-socket-hook";

console.log("feathers!");
window.FEATHERS_IO = io;

var socket = io({
  transports: ['websocket']
});
const feathersClient = feathers()
  .configure(socketio(socket))
  .configure(hooks())
  .configure(auth());

export default feathersClient;
