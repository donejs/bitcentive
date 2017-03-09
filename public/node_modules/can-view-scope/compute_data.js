var Observation = require('can-observation');
var observeReader = require('can-observation/reader/reader');
var makeCompute = require('can-compute');

var types = require('can-types');
var isFunction = require('can-util/js/is-function/is-function');
var isEmptyObject = require('can-util/js/is-empty-object/is-empty-object');


// The goal of this is to create a high-performance compute that represents a key value from can.view.Scope.
// If the key value is something like {{name}} and the context is a can.Map, a faster
// binding path will be used where new rebindings don't need to be looked for with every change of
// the observable property.
// However, if the property changes to a compute, then the slower `can.compute.read` method of
// observing values will be used.

var isFastPath = function(computeData){
	if(  computeData.reads &&
				// a single property read
				computeData.reads.length === 1 ) {
		var root = computeData.root;
		if( types.isCompute(root) ) {
			root = root();
		}
		// on a map
		return types.isMapLike(root) &&
			// that isn't calling a function
			!isFunction(root[computeData.reads[0].key]);
	}
	return;
};

var scopeReader = function(scope, key, options, computeData, newVal){
	if (arguments.length > 4) {
		var root = computeData.root || computeData.setRoot;
		if(root) {
			observeReader.write(root, computeData.reads, newVal, options);
		} else {
			scope.set(key, newVal, options);
		}
		// **Compute getter**
	} else {
		// If computeData has found the value for the key in the past in an observable then go directly to
		// the observable (computeData.root) that the value was found in the last time and return the new value.  This
		// is a huge performance gain for the fact that we aren't having to check the entire scope each time.
		if (computeData.root) {
			return observeReader.read(computeData.root, computeData.reads, options)
				.value;
		}
		// If the key has not already been located in a observable then we need to search the scope for the
		// key.  Once we find the key then we need to return it's value and if it is found in an observable
		// then we need to store the observable so the next time this compute is called it can grab the value
		// directly from the observable.
		var data = scope.read(key, options);
		computeData.scope = data.scope;
		computeData.initialValue = data.value;
		computeData.reads = data.reads;
		computeData.root = data.rootObserve;
		computeData.setRoot = data.setRoot;
		return data.value;
	}
};

module.exports = function(scope, key, options){
	options = options || {
		args: []
	};
	// the object we are returning
	var computeData = {},
		// a function that can be passed to Observation, or used as a setter
		scopeRead = function (newVal) {
			if(arguments.length) {
				return scopeReader(scope, key, options, computeData, newVal);
			} else {
				return scopeReader(scope, key, options, computeData);
			}
		},
		compute = makeCompute(undefined,{
			on: function() {
				// setup the observing
				observation.start();

				if( isFastPath(computeData) ) {
					// When the one dependency changes, we can simply get its newVal and
					// save it.  If it's a function, we need to start binding the old way.
					observation.dependencyChange = function(ev, newVal){

						if(types.isMapLike(ev.target) && typeof newVal !== "function") {
							this.newVal = newVal;
						} else {
							// restore
							observation.dependencyChange = Observation.prototype.dependencyChange;
							observation.start = Observation.prototype.start;
							compute.fastPath = false;
						}
						return Observation.prototype.dependencyChange.call(this, ev);
					};
					observation.start = function(){
						this.value = this.newVal;
					};
					compute.fastPath = true;
				}
				// TODO deal with this right
				compute.computeInstance.value = observation.value;
				compute.computeInstance.hasDependencies = !isEmptyObject(observation.newObserved);
			},
			off: function(){
				observation.stop();
			},
			set: scopeRead,
			get: scopeRead,
			// a hack until we clean up can.compute for 3.0
			__selfUpdater: true
		}),

		// the observables read by the last calling of `scopeRead`
		observation = new Observation(scopeRead, null, compute.computeInstance);
	compute.computeInstance.observation = observation;
	computeData.compute = compute;
	return computeData;

};
