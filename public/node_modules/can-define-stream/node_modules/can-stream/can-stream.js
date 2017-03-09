var compute = require('can-compute');
var Kefir = require('kefir');
var makeArray = require("can-util/js/make-array/make-array");
var assign = require("can-util/js/assign/assign");
var canEvent = require('can-event');


var canStream = {};

/*
 * Pipes the value of a compute into a stream
 */
canStream.singleComputeToStream = function (compute) {
	return Kefir.stream(function (emitter) {
		var changeHandler = function (ev, newVal) {
			emitter.emit(newVal);
		};

		compute.on('change', changeHandler);

		emitter.emit(compute());

		return function () {
			compute.off('change', changeHandler);
		};
	});
};


/*
 * Converts all arguments passed into a single stream and resolves the resulting
 * streams into a single stream. Assumes all arguments are computes and last
 * argument is optionally a function.
 */
canStream.toStreamFromCompute = function () {
	var computes = makeArray(arguments);
	var callback;

	if (computes[computes.length - 1].isComputed) {
		callback = function () {
			return arguments.length > 1 ? Kefir.merge(arguments) : arguments[0];
		};
	} else {
		callback = computes.pop();
	}

	var streams = computes.map(canStream.singleComputeToStream);
	return callback.apply(this, streams);
};

/*
 * Returns a single stream for a property on an {observable}
 */
canStream.toStreamFromProperty = function( obs, propName ) {
	return canStream.toStreamFromCompute(compute(obs, propName));
};

/*
 * Returns a single stream for a specific event on an {observable} property
 */
canStream.toStreamFromEvent = function() {
	var obs = arguments[0];
	var eventName, propName;


	if(arguments.length === 2) {
		//.toStreamFromEvent(obs, event);
		eventName = arguments[1];
        return Kefir.stream(function (emitter) {
			var handler = function(ev){
                var clone = assign({}, ev);
                clone.args = Array.prototype.slice.call(arguments, 1);
                emitter.emit(clone);
            };

			canEvent.addEventListener.call(obs, eventName, handler);

			return function(){
				canEvent.removeEventListener.call(obs, eventName, handler);
            };
        });
    } else {
		//.toStreamFromEvent(obs, propName, event);
		propName = arguments[1];
		eventName = arguments[2];

		var propValueStream = canStream.toStreamFromProperty(obs, propName);

		return Kefir.stream(function (emitter) {
            var handler = function(ev){
                var clone = assign({}, ev);
                clone.args = Array.prototype.slice.call(arguments, 1);
                emitter.emit(clone);
            };
            var curValue;

            propValueStream.onValue(function(value){
                if(curValue) {
                    canEvent.removeEventListener.call(curValue, eventName, handler);
                }
                if(value) {
                    canEvent.addEventListener.call(value, eventName, handler);
                }
                curValue = value;
            });


            return function(){
                if(curValue) {
                    canEvent.removeEventListener.call(curValue, eventName, handler);
                }
            };
        });
    }
};

/*
 * Takes multiple streams and returns a single stream
 */
canStream.toSingleStream = function() {
	return Kefir.merge(arguments);
};

/*
 * A single API to handle most of the cases
 */
canStream.toStream = function() {

	if(arguments.length === 1) {
		//we expect it to be a compute:
		return canStream.toStreamFromCompute(arguments[0]); //toStream(compute)
	}
	else if(arguments.length > 1) {
		var obs = arguments[0];
		var eventNameOrPropName = arguments[1].trim();

		if(eventNameOrPropName.indexOf(" ") === -1) {
			//no space found (so addressing the first three)
			if(eventNameOrPropName.indexOf(".") === 0) {
				//starts with a dot
				return canStream.toStreamFromProperty(obs, eventNameOrPropName.slice(1)); //toStream(obj, "tasks")
			}
			else {
				return canStream.toStreamFromEvent(obs, eventNameOrPropName); //toStream( obj, "close")
			}
		}
		else {
			var splitEventNameAndProperty = eventNameOrPropName.split(" ");
			return canStream.toStreamFromEvent(obs, splitEventNameAndProperty[0].slice(1), splitEventNameAndProperty[1]);  //toStream(obj, "tasks add")
		}
	}
	return undefined;
};



module.exports = canStream;
