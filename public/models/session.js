/* global window */
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import User from 'bitcentive/models/user';
import canEvent from 'can-event';

import superModel from './super-model';
import feathersClient from './feathers';
import feathersSession from 'can-connect-feathers/session';
import {authAgent} from 'authentication-popups';
import decode from 'jwt-decode';

import sessionAlgebra from './algebras/id-comparator';

var Session = DefineMap.extend('Session', {
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
  '*': Session
});

Session.connection = superModel([feathersSession], {
  feathersClient,
  Map: Session,
  List: Session.List,
  name: 'session',
  algebra: sessionAlgebra,
});
Session.algebra = sessionAlgebra;

Object.assign(Session, canEvent);
window.authAgent.on('login', function (token) {
  let payload = decode(token);
  Session.connection.createInstance(payload);
  Session.trigger('created', [payload]);
});

export default Session;
