var Observation = require('can-observation');
var assign = require('can-util/js/assign/assign');
var CID = require('can-cid');
var types = require('can-types');
var dev = require('can-util/js/dev/dev');
var canEvent = require('can-event');
var each = require("can-util/js/each/each");

var observeReader;
var isAt = function(index, reads) {
	var prevRead = reads[index-1];
	return prevRead && prevRead.at;
};

var readValue = function(value, index, reads, options, state, prev){
	// if the previous read is AT false ... we shouldn't be doing this;
	var usedValueReader;
	do {

		usedValueReader = false;
		for(var i =0, len = observeReader.valueReaders.length; i < len; i++){
			if( observeReader.valueReaders[i].test(value, index, reads, options) ) {
				value = observeReader.valueReaders[i].read(value, index, reads, options, state, prev);
				//usedValueReader = true;
			}
		}
	} while(usedValueReader);

	return value;
};

var specialRead = {index: true, key: true, event: true, element: true, viewModel: true};

var checkForObservableAndNotify = function(options, state, getObserves, value, index){
	if(options.foundObservable && !state.foundObservable) {
		if(Observation.trapsCount()) {
			Observation.addAll( getObserves() );
			options.foundObservable(value, index);
			state.foundObservable = true;
		}
	}
};

observeReader = {
	// there are things that you need to evaluate when you get them back as a property read
	// for example a compute or a function you might need to call to get the next value to
	// actually check
	// - isArgument - should be renamed to something like "onLastPropertyReadReturnFunctionInsteadOfCallingIt".
	//   This is used to make a compute out of that function if necessary.
	// - readCompute - can be set to `false` to prevent reading an ending compute.  This is used by component to get a
	//   compute as a delegate.  In 3.0, this should be removed and force people to write "{@prop} change"
	// - callMethodsOnObservables - this is an overwrite ... so normal methods won't be called, but observable ones will.
	// - executeAnonymousFunctions - call a function if it's found, defaults to true
	// - proxyMethods - if the last read is a method, return a function so `this` will be correct.
	// - args - arguments to call functions with.
	//
	// Callbacks
	// - earlyExit - called if a value could not be found
	// - foundObservable - called when an observable value is found
	read: function (parent, reads, options) {
		options = options || {};
		var state = {
			foundObservable: false
		};
		var getObserves;
		if(options.foundObservable) {
			getObserves = Observation.trap();
		}

		// `cur` is the current value.
		var cur = readValue(parent, 0, reads, options, state),
			type,
			// `prev` is the object we are reading from.
			prev,
			// `foundObs` did we find an observable.
			readLength = reads.length,
			i = 0,
			last;

		checkForObservableAndNotify(options, state, getObserves, parent, 0);

		while( i < readLength ) {
			prev = cur;
			// try to read the property
			for(var r=0, readersLength = observeReader.propertyReaders.length; r < readersLength; r++) {
				var reader = observeReader.propertyReaders[r];
				if(reader.test(cur)) {
					cur = reader.read(cur, reads[i], i, options, state);
					break; // there can be only one reading of a property
				}
			}
			checkForObservableAndNotify(options, state, getObserves, prev, i);
			last = cur;
			i = i+1;
			// read the value if it is a compute or function
			cur = readValue(cur, i, reads, options, state, prev);

			checkForObservableAndNotify(options, state, getObserves, prev, i-1);



			type = typeof cur;
			// early exit if need be
			if (i < reads.length && (cur === null || type !== 'function' && type !== 'object')) {
				if (options.earlyExit) {
					options.earlyExit(prev, i - 1, cur);
				}
				// return undefined so we know this isn't the right value
				return {
					value: undefined,
					parent: prev
				};
			}

		}
		// if we don't have a value, exit early.
		if (cur === undefined) {
			if (options.earlyExit) {
				options.earlyExit(prev, i - 1);
			}
		}
		return {
			value: cur,
			parent: prev
		};
	},
	get: function(parent, reads, options){
		return observeReader.read(parent, observeReader.reads(reads), options || {}).value;
	},
	valueReadersMap: {},
	// an array of types that might have a value inside them like functions
	// value readers check the current value
	// and get a new value from it
	// ideally they would keep calling until
	// none of these passed
	valueReaders: [
		{
			name: "function",
			// if this is a function before the last read and its not a constructor function
			test: function(value, i, reads, options){
				return types.isCallableForValue(value) && !types.isCompute(value);
			},
			read: function(value, i, reads, options, state, prev){
				if( isAt(i, reads) ) {
					return i === reads.length ? value.bind(prev) : value;
				}
				else if(options.callMethodsOnObservables && types.isMapLike(prev)) {
					return value.apply(prev, options.args || []);
				}
				else if ( options.isArgument && i === reads.length ) {
					return options.proxyMethods !== false ? value.bind(prev) : value;
				}
				return value.apply(prev, options.args || []);
			}
		},
		{
			name: "compute",
			// compute value reader
			test: function(value, i, reads, options){
				return types.isCompute(value) && !isAt(i, reads);
			},
			read: function(value, i, reads, options, state){
				if(options.readCompute === false && i === reads.length ) {
					return value;
				}
				return value.get ? value.get() : value();
			},
			write: function(base, newVal){
				if(base.set) {
					base.set(newVal);
				} else {
					base(newVal);
				}
			}
		}],
	propertyReadersMap: {},
	// an array of things that might have a property
	propertyReaders: [
		{
			name: "map",
			test: function(){
				return types.isMapLike.apply(this, arguments) || types.isListLike.apply(this, arguments);
			},
			read: function(value, prop, index, options, state){
				var res = value.get ? value.get(prop.key) : value.attr(prop.key);
				if(res !== undefined) {
					return res;
				} else {
					return value[prop.key];
				}
			},
			write: function(base, prop, newVal){
				if(typeof base.set === "function") {
					base.set(prop, newVal);
				} else {
					base.attr(prop, newVal);
				}
			}
		},
		// read a promise
		// it would be good to remove this ... then
		//
		{
			name: "promise",
			test: function(value){
				return types.isPromise(value);
			},
			read: function(value, prop, index, options, state){
				var observeData = value.__observeData;
				if(!value.__observeData) {
					observeData = value.__observeData = {
						isPending: true,
						state: "pending",
						isResolved: false,
						isRejected: false,
						value: undefined,
						reason: undefined
					};
					CID(observeData);
					// proto based would be faster
					assign(observeData, canEvent);
					value.then(function(value){
						observeData.isPending = false;
						observeData.isResolved = true;
						observeData.value = value;
						observeData.state = "resolved";
						observeData.dispatch("state",["resolved","pending"]);
					}, function(reason){
						observeData.isPending = false;
						observeData.isRejected = true;
						observeData.reason = reason;
						observeData.state = "rejected";
						observeData.dispatch("state",["rejected","pending"]);
					});
				}
				Observation.add(observeData,"state");
				return prop.key in observeData ? observeData[prop.key] : value[prop.key];
			}
		},

		// read a normal object
		{
			name: "object",
			// this is the default
			test: function(){return true;},
			read: function(value, prop){
				if(value == null) {
					return undefined;
				} else {
					if(typeof value === "object") {
						if(prop.key in value) {
							return value[prop.key];
						}
						// TODO: remove in 3.0.  This is for backwards compat with @key and @index.
						else if( prop.at && specialRead[prop.key] && ( ("@"+prop.key) in value)) {
							//!steal-remove-start
							dev.warn("Use %"+prop.key+" in place of @"+prop.key+".");

							//!steal-remove-end

							return value["@"+prop.key];
						}
					} else {
						return value[prop.key];
					}
				}
			},
			write: function(base, prop, newVal){
				base[prop] = newVal;
			}
		}
	],
	reads: function(key) {
		var keys = [];
		var last = 0;
		var at = false;
		if( key.charAt(0) === "@" ) {
			last = 1;
			at = true;
		}
		var keyToAdd = "";
		for(var i = last; i < key.length; i++) {
			var character = key.charAt(i);
			if(character === "." || character === "@") {
				if( key.charAt(i -1) !== "\\" ) {
					keys.push({
						key: keyToAdd,
						at: at
					});
					at = character === "@";
					keyToAdd = "";
				} else {
					keyToAdd = keyToAdd.substr(0,keyToAdd.length - 1) + ".";
				}
			} else {
				keyToAdd += character;
			}
		}
		keys.push({
			key: keyToAdd,
			at: at
		});

		return keys;
	},
	// This should be able to set a property similar to how read works.
	write: function(parent, key, value, options) {
		var keys = typeof key === "string" ? observeReader.reads(key) : key;
		var last;
		if(keys.length > 1) {
			last = keys.pop();
			parent = observeReader.read(parent, keys, options).value;
			keys.push(last);
		} else {
			last = keys[0];
		}
		// here's where we need to figure out the best way to write

		// if property being set points at a compute, set the compute
		if( observeReader.valueReadersMap.compute.test(parent[last.key], keys.length - 1, keys, options) ) {
			observeReader.valueReadersMap.compute.write(parent[last.key], value, options);
		} else {
			if(observeReader.valueReadersMap.compute.test(parent, keys.length - 1, keys, options) ) {
				parent = parent();
			}
			if(observeReader.propertyReadersMap.map.test(parent)) {
				observeReader.propertyReadersMap.map.write(parent, last.key, value, options);
			}
			else if(observeReader.propertyReadersMap.object.test(parent)) {
				observeReader.propertyReadersMap.object.write(parent, last.key, value, options);
			}
		}
	}
};
each(observeReader.propertyReaders, function(reader){
	observeReader.propertyReadersMap[reader.name] = reader;
});
each(observeReader.valueReaders, function(reader){
	observeReader.valueReadersMap[reader.name] = reader;
});
observeReader.set = observeReader.write;

module.exports = observeReader;
