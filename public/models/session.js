/* global window */
import feathersClient from './feathers-client';
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
import User from 'bitcentive/models/user';

export const Session = DefineMap.extend('Session', {
  seal: false
}, {
  userId: 'any',
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
  idProp: 'exp',
  Map: Session,
  name: 'session'
});

export default Session;
