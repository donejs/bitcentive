import connect from 'can-connect';
import feathersBehavior from 'can-connect-feathers';
import dataParse from 'can-connect/data/parse/';
import combineRequests from 'can-connect/data/combine-requests/';
import dataCallbacks from 'can-connect/data/callbacks/';
import construct from 'can-connect/constructor/';
import constructStore from 'can-connect/constructor/store/';
import callbacksOnce from 'can-connect/constructor/callbacks-once/';
import canMap from 'can-connect/can/map/';
import canRef from 'can-connect/can/ref/';
import realtime from 'can-connect/real-time/';

var behaviors = [
 feathersBehavior,
 construct,
 canMap,
 canRef,
 constructStore,
 dataCallbacks,
 combineRequests,
 dataParse,
 realtime,
 callbacksOnce
];

const superModel = function(options){
	return connect(behaviors,options);
};

export default superModel;
