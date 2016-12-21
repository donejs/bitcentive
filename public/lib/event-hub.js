/**
 * A simple singleton event emitter for sending messages across the app
 */
import canEvent from 'can-event';
import assign from 'can-util/js/assign/assign';

const hub = {};
assign(hub, canEvent);

window.hub = hub;

export default hub;
