"use strict";
// # can-event/batch/
// Adds task batching abilities to event dispatching.
// Provides a `queue` method to add batched work.
// Overwrites `event.dispatch` to use the task queue when dispatching events.
// Provides a `start` and `stop` method used to a queue.
// Provides `collecting` which returns the queue collecting tasks.
// Provides `dispatching` which returns the queue dispatching tasks.
// Dispatches `batchEnd` when a queue's tasks have been completed.

var canEvent = require('../can-event');
var last = require('can-util/js/last/last');
var namespace = require('can-namespace');
var canTypes = require("can-types");
var canDev = require("can-util/js/dev/dev");

//!steal-remove-start
var group = console.group && console.group.bind(console) || console.log;
var groupEnd = console.groupEnd && console.groupEnd.bind(console) || function() {};
//!steal-remove-end

// Which batch of events this is for -- might not want to send multiple
// messages on the same batch.  This is mostly for event delegation.
var batchNum = 1,
	collectionQueue = null,
	queues = [],
	dispatchingQueues = false,
	makeHandlerArgs = canEvent.makeHandlerArgs,
	getHandlers = canEvent.handlers;

function addToCollectionQueue(item, event, args, handlers){
	var handlerArgs = makeHandlerArgs(event, args);
	var tasks = [];
	for(var i = 0, len = handlers.length; i < len; i++) {
		tasks[i] = [handlers[i], item, handlerArgs];
	}

	[].push.apply(collectionQueue.tasks,tasks);
}


var canBatch = {
	// how many times has start been called without a stop
	transactions: 0,
	/**
	 * @function can-event/batch/batch.start start
	 * @parent can-event/batch/batch
	 * @description Begin an event batch.
	 *
	 * @signature `canBatch.start([batchStopHandler])`
	 *
	 * @param {Function} [batchStopHandler] a callback that gets called after all batched events have been called.
	 *
	 * @body
	 * `canBatch.start` begins an event batch. Until `[can-event/batch/batch.stop]` is called, any
	 * events that would result from calls to [can-event/batch/batch.trigger] to are held back from firing. If you have
	 * lots of changes to make to observables, batching them together can help performance - especially if
	 * those observables are live-bound to the DOM.
	 *
	 * In this example, you can see how the _first_ event is not fired (and their handlers
	 * are not called) until `canBatch.stop` is called.
	 *
	 * ```
	 * var person = new DefineMap({
	 *     first: 'Alexis',
	 *     last: 'Abril'
	 * });
	 *
	 * person.on('first', function() {
	 *     console.log("First name changed.");
	 * }).on('last', function() {
	 *     console.log("Last name changed.");
	 * });
	 *
	 * canBatch.start();
	 * person.first = 'Alex';
	 * console.log('Still in the batch.');
	 * canBatch.stop();
	 *
	 * // the log has:
	 * // Still in the batch.
	 * // First name changed.
	 * ```
	 *
	 * You can also pass a callback to `canBatch.start` which will be called after all the events have
	 * been fired:
	 *
	 * ```
	 * canBatch.start(function() {
	 *     console.log('The batch is over.');
	 * });
	 * person.first = "Izzy"
	 * console.log('Still in the batch.');
	 * canBatch.stop();
	 *
	 * // The console has:
	 * // Still in the batch.
	 * // First name changed.
	 * // The batch is over.
	 * ```
	 *
	 * ## Calling `canBatch.start` multiple times
	 *
	 * If you call `canBatch.start` more than once, `canBatch.stop` needs to be called
	 * the same number of times before any batched events will fire. For ways
	 * to circumvent this process, see [can-event/batch/batch.stop].
	 *
	 * Here is an example that demonstrates how events are affected by calling
	 * `canBatch.start` multiple times.
	 *
	 * ```
	 * var Todo = DefineMap.extend({
	 *   completed: "boolean",
	 *   name: "string"
	 *   updatedAt: "date",
	 *   complete: function(){
	 *     canBatch.start();
	 *     this.completed = true;
	 *     this.updatedAt = new Date();
	 *     canBatch.end();
	 *   }
	 * });
	 *
	 * Todo.List = DefineList.extend({
	 *   "#": Todo,
	 *   completeAll: function(){
	 *     this.forEach(function(todo){
	 *       todo.complete();
	 *     });
	 *   }
	 * });
	 *
	 * var todos = new Todo.List([
	 *   {name: "dishes", completed: false},
	 *   {name: "lawn", completed: false}
	 * ]);
	 *
	 * todos[0].on("completed", function(ev){
	 *   console.log("todos[0] "+ev.batchNum);
	 * })
	 * todos[1].on("completed", function(ev){
	 *   console.log("todos[1] "+ev.batchNum);
	 * });
	 *
	 * todos.completeAll();
	 * // console.logs ->
	 * //        todos[0] 1
	 * //        todos[1] 1
	 * ```
	 */
	start: function (batchStopHandler) {
		canBatch.transactions++;
		if(canBatch.transactions === 1) {
			var queue = {
				// the batch number
				number: batchNum++,

				// where are we in the task queue
				index: 0,
				tasks: [],

				// the batch end event has fired
				batchEnded: false,

				// where are we in the post-batch queue
				callbacksIndex: 0,
				callbacks: [],

				// if everything this batch can do has been done
				complete: false
			};

			if (batchStopHandler) {
				queue.callbacks.push(batchStopHandler);
			}
			collectionQueue = queue;
		}

	},
	/**
	 * @function can-event/batch/batch.collecting collecting
	 * @parent can-event/batch/batch
	 *
	 * @signature `batch.collecting()`
	 *
	 * Returns the Queue that is currently collecting tasks.
	 *
	 * ```
	 * batch.start();
	 * batch.collecting() //-> Queue
	 *
	 * batch.stop();
	 * batch.collecting() //-> null
	 * ```
	 *
	 * @return {can-event/batch/Queue} The queue currently collecting tasks.
	 */
	collecting: function(){
		return collectionQueue;
	},
	/**
	 * @function can-event/batch/batch.dispatching dispatching
	 * @parent can-event/batch/batch
	 *
	 * @signature `batch.dispatching()`
	 *
	 * Returns the Queue that is executing tasks.
	 *
	 * ```
	 * var canEvent = require("can-event");
	 * var batch = require("can-event/batch/batch");
	 *
	 *
	 * var obj = Object.assign({}, canEvent);
	 *
	 *
	 *
	 * batch.start();
	 * obj.dispatch("first");
	 * batch.stop();
	 * ```
	 *
	 * @return {can-event/batch/Queue} The queue currently executing tasks.
	 */
	dispatching: function(){
		return queues[0];
	},
	/**
	 * @function can-event/batch/batch.stop stop
	 * @parent can-event/batch/batch
	 * @description End an event batch.
	 *
	 * @signature `canBatch.stop([force[, callStart]])`
	 *
	 * If this call to `stop` matches the number of calls to `start`, all of this batch's [can-event/batch/batch.trigger triggered]
	 * events will be dispatched.  If the firing of those events creates new events, those new events will be dispatched
	 * after the current batch in their own batch.
	 *
	 * @param {bool} [force=false] Whether to stop batching events immediately.
	 * @param {bool} [callStart=false] Whether to call [can-event/batch/batch.start] after firing batched events.
	 *
	 * @body
	 *
	 * `canBatch.stop` matches an earlier `[can-event/batch/batch.start]` call. If `canBatch.stop` has been
	 * called as many times as `canBatch.start` (or if _force_ is true), all batched events will be
	 * fired and any callbacks passed to `canBatch.start` since the beginning of the batch will be
	 * called. If _force_ and _callStart_ are both true, a new batch will be started when all
	 * the events and callbacks have been fired.
	 *
	 * See `[can-event/batch/batch.start]` for examples of `canBatch.start` and `canBatch.stop` in normal use.
	 *
	 */
	stop: function (force, callStart) {
		if (force) {
			canBatch.transactions = 0;
		} else {
			canBatch.transactions--;
		}
		if (canBatch.transactions === 0) {
			queues.push(collectionQueue);
			collectionQueue = null;
			if(!dispatchingQueues) {
				canEvent.flush();
			}
		}
	},
	// Flushes the current
	flush: function() {
		//!steal-remove-start
		var debug = canDev.logLevel >= 1;
		//!steal-remove-end

		dispatchingQueues = true;
		while(queues.length) {
			var queue = queues[0];
			var tasks = queue.tasks,
				callbacks = queue.callbacks;

			canBatch.batchNum = queue.number;

			var len = tasks.length,
				index;

			//!steal-remove-start
			if(debug && queue.index === 0 && queue.index < len) {
				group("batch running "+queue.number);
			}
			//!steal-remove-end

			while(queue.index < len) {
				index = queue.index++;
				//!steal-remove-start
				if(debug) {
					var context = tasks[index][1];
					var args = tasks[index][2];
					if(args && args[0]) {
						console.log("dispatching",args[0].type, "on",context);
					}
				}
				//!steal-remove-end
				tasks[index][0].apply(tasks[index][1],tasks[index][2]);
			}

			if(!queue.batchEnded) {
				//!steal-remove-start
				if(debug) {
					console.log("tasks ended");
				}
				//!steal-remove-end
				queue.batchEnded = true;
				canEvent.dispatchSync.call(canBatch,"batchEnd",[queue.number]);
			}

			//!steal-remove-start
			if(debug && queue.callbacksIndex < callbacks.length) {
				console.log("calling callbacks");
			}
			//!steal-remove-end

			while(queue.callbacksIndex < callbacks.length) {
				callbacks[queue.callbacksIndex++]();
			}


			if(!queue.complete) {
				queue.complete = true;
				canBatch.batchNum = undefined;
				queues.shift();

				//!steal-remove-start
				if(debug) {
					groupEnd();
				}
				//!steal-remove-end
			}

		}
		dispatchingQueues = false;
	},
	/**
	 * @function can-event/batch/batch.dispatch dispatch
	 * @parent can-event/batch/batch
	 * @description Dispatchs an event within the event batching system.
	 * @signature `canBatch.trigger(item, event [, args])`
	 *
	 * Makes sure an event is fired at the appropriate time within the appropriate batch.
	 * How and when the event fires depends on the batching state.
	 *
	 * There are three states of batching:
	 *
	 * - no queues - `trigger` is called outside of any `start` or `stop` call -> The event is dispatched immediately.
	 * - collecting batch - `trigger` is called between a `start` or `stop` call -> The event is dispatched when `stop` is called.
	 * - firing queues -  `trigger` is called due to another `trigger` called within a batch -> The event is dispatched after the current batch has completed in a new batch.
	 *
	 * Finally, if the event has a `batchNum` it is fired immediately.
	 *
	 * @param {Object} item the target of the event.
	 * @param {String|{type: String}} event the type of event, or an event object with a type given like `{type: 'name'}`
	 * @param {Array} [args] the parameters to trigger the event with.
	 *
	 * @body
	 *
	 */
	dispatch: function (event, args) {
		var item = this,
			handlers;
		// Don't send events if initalizing.
		if (!item.__inSetup) {
			event = typeof event === 'string' ? {
				type: event
			} : event;

			// If this is trying to belong to another batch, let it fire
			if(event.batchNum) {
				// It's a possibility we want to add this to the
				// end of the tasks if they haven't completed yet.
				canEvent.dispatchSync.call( item, event, args );
			}
			// if there's a batch, add it to this queues events
			else if(collectionQueue) {

				handlers = getHandlers.call(this, event.type);
				if(handlers) {
					event.batchNum = collectionQueue.number;
					addToCollectionQueue(item, event, args, handlers);
				}
			}
			// if there are queues, but this doesn't belong to a batch
			// add it to its own batch fired at the end
			else if(queues.length) {
				// start a batch so it can be colllected.
				// this should never hit in async
				handlers = getHandlers.call(this, event.type);
				if(handlers) {
					canBatch.start();
					event.batchNum = collectionQueue.number;
					addToCollectionQueue(item, event, args, handlers);
					last(queues).callbacks.push(canBatch.stop);
				}


			}
			// there are no queues, so just fire the event.
			else {
				handlers = getHandlers.call(this, event.type);
				if(handlers) {
					canBatch.start();
					event.batchNum = collectionQueue.number;
					addToCollectionQueue(item, event, args, handlers);
					canBatch.stop();
				}
			}
		}
	},
	/**
	 * @function can-event/batch/batch.queue queue
	 * @parent can-event/batch/batch
	 * @description Queues a method to be called.
	 *
	 * @signature `batch.queue(task)`
	 *
	 * Queues a method to be called in the current [can-event/batch/batch.collecting]
	 * queue if there is one.  If there is a [can-event/batch/batch.dispatching] queue,
	 * it will create a batch and add the task to that batch.
	 * Finally, if there is no batch, the task will be executed immediately.
	 *
	 * ```
	 * var me = {
	 *   say: function(message){
	 *     console.log(this.name,"says", message);
	 *   }
	 * }
	 * batch.queue([me.say, me, ["hi"]]);
	 * ```
	 *
	 * @param  {Array<function,*,Array>} task An array that details a
	 * function to be called, the context the function should be called with, and
	 * the arguments to the function like: `[function,context, [arg1, arg2]]`
	 */
	queue: function(task, inCurrentBatch){
		if(collectionQueue) {
			collectionQueue.tasks.push(task);
		}
		// if there are queues, but this doesn't belong to a batch
		// add it to its own batch
		else if(queues.length) {
			if(inCurrentBatch && queues[0].index < queues.tasks.length) {
				queues[0].tasks.push(task);
			} else {
				canBatch.start();
				collectionQueue.tasks.push(task);
				last(queues).callbacks.push(canBatch.stop);
			}
		}
		// there are no queues, so create one and run it.
		else {
			canBatch.start();
			collectionQueue.tasks.push(task);
			canBatch.stop();
		}
	},
	queues: function(){
		return queues;
	},
	/**
	 * @function can-event/batch/batch.afterPreviousEvents afterPreviousEvents
	 * @parent can-event/batch/batch
	 * @description Run code when all previuos state has settled.
	 *
	 * @signature `canBatch.afterPreviousEvents(handler)`
	 *
	 * Calls `handler` when all previously [can-event/batch/batch.trigger triggered] events have
	 * been fired.  This is useful to know when all fired events match the current state.
	 *
	 * @param {function} handler A function to call back when all previous events have fired.
	 *
	 * @body
	 *
	 *
	 * ## Use
	 *
	 * With batching, it's possible for a piece of code to read some observable, and listen to
	 * changes in that observable, but have events fired that it should ignore.
	 *
	 * For example, consider a list widget that creates `<li>`'s for each item in the list and listens to
	 * updates in that list and adds or removes `<li>`s:
	 *
	 * ```js
	 * var makeLi = function(){
	 *   return document.createElement("li")
	 * };
	 *
	 * var listWidget = function(list){
	 *   var lis = list.map(makeLi);
	 *   list.on("add", function(ev, added, index){
	 *     var newLis = added.map(makeLi);
	 *     lis.splice.apply(lis, [index, 0].concat(newLis) );
	 *   }).on("remove", function(ev, removed, index){
	 *     lis.splice(index, removed.length);
	 *   });
	 *
	 *   return lis;
	 * }
	 * ```
	 *
	 * The problem with this is if someone calls `listWidget` within a batch:
	 *
	 * ```js
	 * var list = new DefineList([]);
	 *
	 * canBatch.start();
	 * list.push("can-event","can-event/batch/");
	 * listWidget(list);
	 * canBatch.stop();
	 * ```
	 *
	 * The problem is that list will immediately create an `li` for both `can-event` and `can-event/batch/`, and then,
	 * when `canBatch.stop()` is called, the `add` event listener will create duplicate `li`s.
	 *
	 * The solution, is to use `afterPreviousEvents`:
	 *
	 * ```js
	 * var makeLi = function(){
	 *   return document.createElement("li")
	 * };
	 *
	 * var listWidget = function(list){
	 *   var lis = list.map(makeLi);
	 *   canBatch.afterPreviousEvents(function(){
	 *     list.on("add", function(ev, added, index){
	 *       var newLis = added.map(makeLi);
	 *       lis.splice.apply(lis, [index, 0].concat(newLis) );
	 *     }).on("remove", function(ev, removed, index){
	 *       lis.splice(index, removed.length);
	 *     });
	 *   });
	 *
	 *   return lis;
	 * }
	 * ```
	 *
	 */
	// call handler after any events from currently settled stated have fired
	// but before any future change events fire.
	afterPreviousEvents: function(handler){
		this.queue([handler]);
	},
	after: function(handler){
		var queue = collectionQueue || queues[0];

		if(queue) {
			queue.callbacks.push(handler);
		} else {
			handler({});
		}
	}
};


canEvent.flush = canBatch.flush;
canEvent.dispatch = canBatch.dispatch;

canBatch.trigger = function(){
	console.warn("use canEvent.dispatch instead");
	return canEvent.dispatch.apply(this, arguments);
};

canTypes.queueTask = canBatch.queue;

module.exports = namespace.batch = canBatch;
