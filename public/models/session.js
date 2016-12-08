/* global window */
import connect from 'can-connect';
import dataParse from 'can-connect/data/parse/';
import construct from 'can-connect/constructor/';
import constructStore from 'can-connect/constructor/store/';
import constructOnce from 'can-connect/constructor/callbacks-once/';
import canMap from 'can-connect/can/map/';
import canRef from 'can-connect/can/ref/';
import dataCallbacks from 'can-connect/data/callbacks/';
import realtime from 'can-connect/real-time/';

import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import User from 'bitcentive/models/user';
import canEvent from 'can-event';

import algebra from './algebras';

import feathersClient from './feathers-client';
import feathersSession from 'can-connect-feathers/session';
import {authAgent} from 'feathers-authentication-popups';
import decode from 'jwt-decode';

export const Session = DefineMap.extend('Session', {
  seal: false
}, {
  _id: '*',
  email: 'string',
  password: 'string',
  user: {
    Type: User,
    get (lastSetVal, resolve) {
      if (lastSetVal) {
        return lastSetVal;
      }
      if (this._id) {
        User.get({_id: this._id}).then(resolve);
      }
    }
  }
});

Session.List = DefineList.extend({
  '#': Session
});

Session.connection = connect([
    feathersSession,
    dataParse,
    construct,
    constructStore,
    constructOnce,
    canMap,
    canRef,
    dataCallbacks,
    realtime
], {
  feathersClient,
  Map: Session,
  List: Session.List,
  name: 'session',
  algebra
});

Session.algebra = algebra;

Object.assign(Session, canEvent);
// TODO: look at removing 'window' here
window.authAgent.on('login', function (token) {
  let payload = decode(token);
  Session.connection.createInstance(payload);
  Session.trigger('created', [payload]);
});

export default Session;
