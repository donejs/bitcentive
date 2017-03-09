/* global window */
/**
 * @module {can-map} bitcentive/models/session Session
 * @parent bitcentive.clientModels
 *
 * Represents user's session. Gets populated with data from JWT token.
 *
 * @group bitcentive/models/session.properties 0 properties
 */

import feathersSession from 'can-connect-feathers/session/';
import connect from 'can-connect';
import dataParse from 'can-connect/data/parse/';
import construct from 'can-connect/constructor/';
import constructStore from 'can-connect/constructor/store/';
import canMap from 'can-connect/can/map/';
import canRef from 'can-connect/can/ref/';
import callbacksOnce from 'can-connect/constructor/callbacks-once/';
import dataCallbacks from 'can-connect/data/callbacks/';
import realtime from 'can-connect/real-time/';
import DefineMap from 'can-define/map/';
import set from 'can-set';

import feathersClient from './feathers-client';
import User from 'bitcentive/models/user';

export const Session = DefineMap.extend('Session', {
	/**
	 * @property {String} bitcentive/models/session.properties.userId userId
	 * @parent bitcentive/models/session.properties
	 * Id of the user.
	 */
  userId: 'any',

	/**
	 * @property {bitcentive/models/user} bitcentive/models/session.properties.user user
	 * @parent bitcentive/models/session.properties
	 * The logged user.
	 */
  user: {
    Type: User,
    get (lastSetVal, resolve) {
      if (lastSetVal) {
        return lastSetVal;
      }
      if (this.userId) {
        User.get({_id: this.userId}).then(resolve);
      }
    }
  }
});

/**
 * @property {can-set/Algebra} bitcentive/models/session.static.algebra algebra
 * @parent bitcentive/models/session.static
 * An algebra for the connection. Defines `exp` as id property.
 */
Session.algebra =  new set.Algebra(
  set.comparators.id('exp')
);

/**
 * @property {can-connect} bitcentive/models/session.static.connection connection
 * @parent bitcentive/models/session.static
 *
 * Uses {can-connect-feathers/Session} behavior and {feathers/client} wrapper around SocketIO to connect to a FeathersJS server.
 */
Session.connection = connect([
    feathersSession,
    construct,
    canMap,
    canRef,
    constructStore,
    dataCallbacks,
    dataParse,
    realtime,
    callbacksOnce
], {
  feathersClient,
  Map: Session,
  name: 'session',
  algebra: Session.algebra
});

export default Session;
