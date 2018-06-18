/**
 * A simple singleton event emitter for sending messages across the app
 */
import mixinMapBindings from 'can-event-queue/map/map';

const hub = {};
mixinMapBindings(hub);

export default hub;
