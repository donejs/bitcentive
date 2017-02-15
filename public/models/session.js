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
import Zone from 'can-zone';

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
	      //return {"githubId":1895948,"__v":0};
	      //Zone.ignore(function(){
		      User.get({_id: this.userId}).then(function(data){
			      console.log('user is OK', data);
			      resolve(data);
		      });
	      //})();
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
