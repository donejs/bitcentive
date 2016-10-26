/* global window */
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';

import feathersClient from './feathers';
import connect from 'can-connect';
import feathersBehavior from 'can-connect-feathers';
import dataParse from 'can-connect/data/parse/';
import construct from 'can-connect/constructor/';
import constructStore from 'can-connect/constructor/store/';
import constructOnce from 'can-connect/constructor/callbacks-once/';
import canMap from 'can-connect/can/map/';
import canRef from 'can-connect/can/ref/';
import dataCallbacks from 'can-connect/data/callbacks/';
import realtime from 'can-connect/real-time/';

var behaviorList = [
  dataParse,
  construct,
  constructStore,
  constructOnce,
  canMap,
  canRef,
  dataCallbacks,
  realtime,
  feathersBehavior
];

export const Signup = DefineMap.extend('Signup', {
  _id: '*',
  email: 'string',
  password: 'string'
});

Signup.List = DefineList.extend({
  '*': Signup
});

export const signupConnection = connect(behaviorList, {
  parseInstanceProp: 'data',
  feathersService: feathersClient.service('/signup'),
  idProp: '_id',
  Map: Signup,
  List: Signup.List,
  name: 'signup'
});

export default Signup;
