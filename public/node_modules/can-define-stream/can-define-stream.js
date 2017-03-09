var define = require('can-define');
var canStream = require('can-stream');
var assign = require("can-util/js/assign/assign");
var DefineMap = require('can-define/map/map');
var DefineList = require('can-define/list/list');
var Kefir = require("kefir");
var compute = require("can-compute");


var oldExtensions = define.extensions;
define.behaviors.push('stream');


var makeComputeWithSetter = function (valueStream, willHaveEmitter) {

	var streamHandler, lastValue;

	// Create a compute that will bind to the resolved stream when bound
	var valueCompute = compute(undefined, {

		// When the compute is read, use that last value
		get: function () {
			return lastValue;
		},
		set: function (val) {
			willHaveEmitter.emitter.emit(val);
			return val;
		},

		// When the compute is bound, bind to the resolved stream
		on: function (updated) {

			// When the stream passes a new values, save a reference to it and call
			// the compute's internal `updated` method (which ultimately calls `get`)
			streamHandler = function (val) {
				lastValue = val;
				updated();
			};
			valueStream.onValue(streamHandler);
		},

		// When the compute is unbound, unbind from the resolved stream
		off: function () {
			valueStream.offValue(streamHandler);
		}
	});

	// Return the compute that's bound to the stream
	return valueCompute;
};


var makeComputeFromStream = function(map, makeStream){
	var willHaveEmitter= {};
	var setterStream = Kefir.stream(function (emitter) {
		willHaveEmitter.emitter = emitter;
	});

	var valueStream = makeStream.call(map, setterStream);

	return makeComputeWithSetter(valueStream, willHaveEmitter);
};

/**
 * @typedef {function} can-define-stream.stream stream
 * @parent can-define-stream/behaviors
 *
 * Define a property value from a stream of values.
 *
 * @signature `stream( setterStream )`
 *
 * The `stream` behavior is an available property definition on the
 * [can-define.types.propDefinition] of all [can-define] types.
 *
 * It is useful for deriving values that [can-define.types.get] can not, for example
 * deriving values based around the change in another value intead of the values themselves.
 *
 * ```js
 * var Person = DefineMap.extend({
 *   name: "string",
 *   lastValidName: {
 *     stream: function(){
 *       return this.stream(".name").filter(function(name){
 *         return name.indexOf(" ") >= 0;
 *       })
 *     }
 *   }
 * });
 *
 * var me = new Person({name: "James"});
 *
 * me.on("lastValidName", function(lastValid) {
 *   console.log(lastValid)
 * });
 *
 * me.name = "JamesAtherton";
 *
 * me.name = "James Atherton";
 * //-> console.logs "James Atherton";
 *
 * me.name = "JustinMeyer";
 *
 * me.name = "Justin Meyer";
 * //-> console.logs "Justin Meyer";
 * ```
 *
 * The property __must__ be bound before a value can be read.
 *
 * @param {Stream} [setterStream] The stream of values set on this property like `obj.prop = value`.
 * @return {Stream} A stream whose last value will be used as the property value.
 */
define.extensions = function (objPrototype, prop, definition) {

	if (definition.stream) {
		return assign({
			value: function() {
				return makeComputeFromStream(this, definition.stream);
			}
		}, define.types.compute);

	} else {
		return oldExtensions.apply(this, arguments);
	}
};
/**
 * @function can-define-stream/DefineMap.prototype.stream stream
 * @parent can-define-stream/DefineMap.prototype
 *
 * @description An alias to [can-stream.toStream].
 *
 * @signature `map.toStream("[.propName][ eventName]")`
 *
 * Creates a stream for the property and/or event.
 *
 * ```
 * map.toStream(".tasks.length") //-> stream of .task.length values
 * map.toStream("tasks")         //-> stream of tasks events
 * map.toStream(".tasks add")    //-> stream of add events on .tasks
 * ```
 *
 * @param {String} propName A property name to listen to value changes. These should
 * always being with a `.`.
 *
 * @param {String} eventName An event name to listen for and create a stream from the event
 * argument. The event name doesn't start with a `.`.
 *
 * @return {Stream} An event stream.
 */

 /**
  * @function can-define-stream/DefineList.prototype.stream stream
  * @parent can-define-stream/DefineList.prototype
  * @description An alias to [can-stream.toStream].
  *
  * @signature `list.toStream("[.propName][ eventName]")`
  *
  * Creates a stream for the property and/or event.
  *
  * ```
  * list.toStream(".complete.length") //-> stream of .complete.length values
  * list.toStream("complete")         //-> stream of complete events
  * list.toStream(".complete add")    //-> stream of add events on .complete
  * ```
  *
  * @param {String} propName A property name to listen to value changes. These should
  * always being with a `.`.
  *
  * @param {String} eventName An event name to listen for and create a stream from the event
  * argument. The event name doesn't start with a `.`.
  *
  * @return {Stream} An event stream.
  */

DefineList.prototype.stream = DefineMap.prototype.stream = function() {
	[].unshift.call(arguments, this);
	return canStream.toStream.apply(this, arguments);
};
