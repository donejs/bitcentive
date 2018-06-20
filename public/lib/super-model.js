import connect from 'can-connect';
import dataParse from 'can-connect/data/parse/';
import construct from 'can-connect/constructor/';
import constructStore from 'can-connect/constructor/store/';
import constructOnce from 'can-connect/constructor/callbacks-once/';
import canMap from 'can-connect/can/map/';
import canRef from 'can-connect/can/ref/';
import dataCallbacks from 'can-connect/data/callbacks/';
import realtime from 'can-connect/real-time/';
import errorHandler from './behaviors/error-handler';
import feathersBehavior from 'can-connect-feathers/service';

const superModel = function(options) {
	// TODO: remove this when this issue is closed:
	// https://github.com/canjs/can-connect/issues/100
	options.idProp = "_id";

	const behaviors = [
		feathersBehavior,
		dataParse,
		construct,
		constructStore,
		constructOnce,
		canMap,
		canRef,
		dataCallbacks,
		realtime,
		errorHandler
	];

	return connect(behaviors, options);
};

export default superModel;
