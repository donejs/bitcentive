import connect from 'can-connect';
import dataParse from 'can-connect/data/parse/';
import construct from 'can-connect/constructor/';
import constructStore from 'can-connect/constructor/store/';
import constructOnce from 'can-connect/constructor/callbacks-once/';
import canMap from 'can-connect/can/map/';
import canRef from 'can-connect/can/ref/';
import dataCallbacks from 'can-connect/data/callbacks/';
import realtime from 'can-connect/real-time/';

const superModel = function(newBehaviors, options) {
	if(arguments.length === 1) {
		options = newBehaviors;
	}

	const behaviors = [
		dataParse,
		construct,
		constructStore,
		constructOnce,
		canMap,
		canRef,
		dataCallbacks,
		realtime
	];

	if(arguments.length === 2) {
		Array.prototype.unshift.apply(behaviors, newBehaviors);
	}

	return connect(behaviors, options);
};

export default superModel;