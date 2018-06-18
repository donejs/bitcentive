import io from 'socket.io-client/dist/socket.io';
import fixtureSocket from 'can-fixture-socket';
//import io from 'steal-socket.io';
//
console.log("fixtures!");
window.FIXTURES_IO = io;
// Mock socket.io server:
export default new fixtureSocket.Server( io );
