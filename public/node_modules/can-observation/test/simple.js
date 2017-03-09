var Observation = require('can-observation');
var CID = require('can-cid');

var assign = require("can-util/js/assign/assign");
var canEvent = require('can-event');
var eventLifecycle = require("can-event/lifecycle/lifecycle");

// a simple observable and compute to test
// behaviors that require nesting of Observations
var simpleObservable = function(value){
	var obs = {
		get: function(){
			Observation.add(this, "value");
			return this.value;
		},
		set: function(value){
			var old = this.value;
			this.value = value;
			canEvent.dispatch.call(this, "value",[value, old]);
		},
		value: value
	};
	assign(obs, canEvent);
	CID(obs);
	return obs;
};

var simpleCompute = function(getter, name, primaryDepth){
	var observation, fn;

	fn = function(){
		Observation.add(fn,"change");
		return observation.get();
	};
	CID(fn, name);
	fn.updater = function(newVal, oldVal, batchNum){
		canEvent.dispatch.call(fn, {type: "change", batchNum: batchNum},[newVal, oldVal]);
	};
	fn._primaryDepth = primaryDepth || 0;

	observation = new Observation(getter, null, fn);

	fn.observation = observation;

	assign(fn, canEvent);
	fn.addEventListener = eventLifecycle.addAndSetup;
	fn.removeEventListener = eventLifecycle.removeAndTeardown;

	fn._eventSetup = function(){
		fn.bound = true;
		observation.start();
	};
	fn._eventTeardown = function(){
		fn.bound = false;
		observation.stop();
	};
	return fn;
};

module.exports = {
	compute: simpleCompute,
	observable: simpleObservable
};
