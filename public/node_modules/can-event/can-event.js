// # can-event
//
// Implements a basic event system that can be used with any type of object.
// In addition to adding basic event functionality, it also provides the `can.event` object
// that can be mixed into objects and prototypes.
//
// Most of the time when this is used, it will be used with the mixin:
//
// ```
// var SomeClass = Construct("SomeClass");
// assign(SomeClass.prototype, canEvent);
// ```
var domEvents = require('can-util/dom/events/events');
var CID = require('can-cid');
var isEmptyObject = require('can-util/js/is-empty-object/is-empty-object');
var domDispatch = require('can-util/dom/dispatch/dispatch');
var namespace = require('can-namespace');
require('can-util/dom/events/delegate/delegate');

function makeHandlerArgs(event, args) {
    if (typeof event === 'string') {
        event = {
            type: event
        };
    }
    var handlerArgs = [event];

    // Execute handlers listening for this event.
    if(args) {
        handlerArgs.push.apply(handlerArgs, args);
    }
    return handlerArgs;
}
function getHandlers(eventName){
    var events = this.__bindEvents;
    if (!events) {
        return;
    }
    var handlers = events[eventName];
    if(!handlers) {
        return;
    } else {
        return handlers;
    }
}


// ## can.event
// Create and export the `can.event` mixin
var canEvent = {
    // First define core object-based methods

    // ## can-event.addEventListener
    //
    // Adds a basic event listener to an object.
    // This consists of storing a cache of event listeners on each object,
    // that are iterated through later when events are dispatched.
    /**
     * @function can-event.addEventListener addEventListener
     * @parent can-event.static
     * @signature `obj.addEventListener(event, handler)`
     *
     * Add a basic event listener to an object.
	 *
	 * ```js
	 * var canEvent = require("can-event");
	 *
	 * var obj = {};
	 * Object.assign(obj, canEvent);
	 *
	 * obj.addEventListener("foo", function(){ ... });
	 * ```
     *
     * @param {String} event The name of the event to listen for.
     * @param {Function} handler The handler that will be executed to handle the event.
     * @return {Object} this
     *
     * @signature `canEvent.addEventListener.call(obj, event, handler)`
     *
     * This syntax can be used for objects that don't include the `canEvent` mixin.
     */
    addEventListener: function (event, handler) {
    	// Initialize event cache.
    	var allEvents = this.__bindEvents || (this.__bindEvents = {}),
    		eventList = allEvents[event] || (allEvents[event] = []);

    	// Add the event
    	eventList.push(handler);
    	return this;
    },

    // ## can-event.removeEventListener
    //
    // Removes a basic event listener from an object.
    // This removes event handlers from the cache of listened events.
    /**
     * @function can-event.removeEventListener removeEventListener
     * @parent can-event.static
     * @signature `obj.removeEventListener(event, handler)`
     *
     * Removes a basic event listener from an object.
     *
     * @param {String} event The name of the event to listen for.
     * @param {Function} handler The handler that will be executed to handle the event.
     * @return {Object} this
     *
     * @signature `canEvent.removeEventListener.call(obj, event, handler)`
     *
     * This syntax can be used for objects that don't include the [can-event] mixin.
     */
    removeEventListener: function (event, fn) {
    	if (!this.__bindEvents) {
    		return this;
    	}
    	var handlers = this.__bindEvents[event] || [],
    		i = 0,
    		handler, isFunction = typeof fn === 'function';
    	while (i < handlers.length) {
    		handler = handlers[i];
    		// Determine whether this event handler is "equivalent" to the one requested
    		// Generally this requires the same event/function, but a validation function
    		// can be included for extra conditions. This is used in some plugins like `can/event/namespace`.
    		if ( isFunction && handler === fn || !isFunction && (handler.cid === fn || !fn)) {
    			handlers.splice(i, 1);
    		} else {
    			i++;
    		}
    	}
    	return this;
    },
    // ## can-event.dispatch
    //
    // Dispatches/triggers a basic event on an object.
    /**
     * @function can-event.dispatch dispatch
     * @parent can-event.static
     * @signature `obj.dispatch(event, [args])`
     *
     * Dispatches/triggers a basic event on an object.
	 *
	 * ```js
	 * var canEvent = require("can-event");
	 *
	 * var obj = {};
	 * Object.assign(obj, canEvent);
	 *
	 * obj.addEventListener("foo", function(){
	 *   console.log("FOO BAR!");
	 * });
	 *
	 * obj.dispatch("foo"); // Causes it to log FOO BAR
	 * ```
     *
     * @param {String|Object} event The event to dispatch
     * @param {Array} [args] Additional arguments to pass to event handlers
     * @return {Object} event The resulting event object
     *
     * @signature `canEvent.dispatch.call(obj, event, args)`
     *
     * This syntax can be used for objects that don't include the `can.event` mixin.
     */
    dispatchSync: function (event, args) {
        var handlerArgs = makeHandlerArgs(event, args);
        var handlers = getHandlers.call(this, handlerArgs[0].type);

    	if(!handlers) {
    		return;
    	}
        handlers = handlers.slice(0);
        for (var i = 0, len = handlers.length; i < len; i++) {
    		handlers[i].apply(this, handlerArgs);
    	}

    	return handlerArgs[0];
    },
	// Define abstract helpers

    /**
     * @function can-event.on on
     * @parent can-event.static
     * @signature `obj.on(event, handler)`
     *
     * Add a basic event listener to an object.
     *
     * This is an alias of [can-event.addEventListener addEventListener].
     *
     * @signature `can-event.on.call(obj, event, handler)`
     *
     * This syntax can be used for objects that don't include the [can-event] mixin.
     */
    on: function(eventName, selector, handler) {
        var method = typeof selector === "string" ? "addDelegateListener" : "addEventListener";

        var listenWithDOM = domEvents.canAddEventListener.call(this);
        var eventBinder = listenWithDOM ? domEvents[method] : this[method] || canEvent[method];

        return eventBinder.apply(this, arguments);
    },

    /**
     * @function can-event.off off
     * @parent can-event.static
     * @signature `obj.off(event, handler)`
     *
     * Removes a basic event listener from an object.
     *
     * This is an alias of [can-event.removeEventListener removeEventListener].
     *
     * @signature `canEvent.off.call(obj, event, handler)`
     *
     * This syntax can be used for objects that don't include the [can-event] mixin.
     */
    off: function(eventName, selector, handler) {
        var method = typeof selector === "string" ? "removeDelegateListener" : "removeEventListener";

        var listenWithDOM = domEvents.canAddEventListener.call(this);
        var eventBinder = listenWithDOM ? domEvents[method] : this[method] || canEvent[method];

        return eventBinder.apply(this, arguments);
    },
    /**
     * @function can-event.trigger trigger
     * @parent can-event.static
     * @signature `obj.trigger(event, args)`
     *
     * Dispatches/triggers a basic event on an object.
     * This is an alias of [can-event.dispatch dispatch].
     *
     * @signature `canEvent.trigger.call(obj, event, args)`
     *
     * This syntax can be used for objects that don't include the [can-event] mixin.
     */
    trigger: function(){
        var listenWithDOM = domEvents.canAddEventListener.call(this);
        var dispatch = listenWithDOM ? domDispatch : canEvent.dispatch;

        return dispatch.apply(this, arguments);
    },

    // ## can-event.one
    //
    // Adds a basic event listener that listens to an event once and only once.
    /**
     * @function can-event.one one
     * @parent can-event.static
     * @signature `obj.one(event, handler)`
     *
     * Adds a basic event listener that listens to an event once and only once.
     *
     * @param {String} event The name of the event to listen for.
     * @param {Function} handler The handler that will be executed to handle the event.
     * @return {Object} this
     */
    one: function(event, handler) {
    	// Unbind the listener after it has been executed
    	var one = function() {
    		canEvent.off.call(this, event, one);
    		return handler.apply(this, arguments);
    	};

    	// Bind the altered listener
    	canEvent.on.call(this, event, one);
    	return this;
    },

    // self listener methods
    // ## can-event.listenTo
    //
    // Listens to an event without know how bind is implemented.
    // The primary use for this is to listen to another's objects event while
    // tracking events on the local object (similar to namespacing).
    //
    // The API was heavily influenced by BackboneJS: http://backbonejs.org/
    /**
     * @function can-event.listenTo listenTo
     * @parent can-event.static
     * @signature `obj.listenTo(other, event, handler)`
     *
     * Listens for an event on another object.
     * This is similar to concepts like event namespacing, except that the namespace
     * is the scope of the calling object.
     *
     * @param {Object} other The object to listen for events on.
     * @param {String} event The name of the event to listen for.
     * @param {Function} handler The handler that will be executed to handle the event.
     * @return {Object} this
     *
     * @signature `canEvent.listenTo.call(obj, other, event, handler)`
     *
     * This syntax can be used for objects that don't include the [can-event] mixin.
     */
    listenTo: function (other, event, handler) {
    	// Initialize event cache
    	var idedEvents = this.__listenToEvents;
    	if (!idedEvents) {
    		idedEvents = this.__listenToEvents = {};
    	}

    	// Identify the other object
    	var otherId = CID(other);
    	var othersEvents = idedEvents[otherId];

    	// Create a local event cache
    	if (!othersEvents) {
    		othersEvents = idedEvents[otherId] = {
    			obj: other,
    			events: {}
    		};
    	}
    	var eventsEvents = othersEvents.events[event];
    	if (!eventsEvents) {
    		eventsEvents = othersEvents.events[event] = [];
    	}

    	// Add the event, both locally and to the other object
    	eventsEvents.push(handler);
    	canEvent.on.call(other, event, handler);
    },
    // ## can-event.stopListening
    //
    // Stops listening for events on other objects
    /**
     * @function can-event.stopListening stopListening
     * @parent can-event.static
     * @signature `obj.stopListening(other, event, handler)`
     *
     * Stops listening for an event on another object.
     *
     * @param {Object} other The object to listen for events on.
     * @param {String} event The name of the event to listen for.
     * @param {Function} handler The handler that will be executed to handle the event.
     * @return {Object} this
     *
     * @signature `canEvent.stopListening.call(obj, other, event, handler)`
     *
     * This syntax can be used for objects that don't include the [can-event] mixin.
     */
    stopListening: function (other, event, handler) {
    	var idedEvents = this.__listenToEvents,
    		iterIdedEvents = idedEvents,
    		i = 0;
    	if (!idedEvents) {
    		return this;
    	}
    	if (other) {
    		var othercid = CID(other);
    		(iterIdedEvents = {})[othercid] = idedEvents[othercid];
    		// you might be trying to listen to something that is not there
    		if (!idedEvents[othercid]) {
    			return this;
    		}
    	}

    	// Clean up events on the other object
    	for (var cid in iterIdedEvents) {
    		var othersEvents = iterIdedEvents[cid],
    			eventsEvents;
    		other = idedEvents[cid].obj;

    		// Find the cache of events
    		if (!event) {
    			eventsEvents = othersEvents.events;
    		} else {
    			(eventsEvents = {})[event] = othersEvents.events[event];
    		}

    		// Unbind event handlers, both locally and on the other object
    		for (var eventName in eventsEvents) {
    			var handlers = eventsEvents[eventName] || [];
    			i = 0;
    			while (i < handlers.length) {
    				if (handler && handler === handlers[i] || !handler) {
    					canEvent.off.call(other, eventName, handlers[i]);
    					handlers.splice(i, 1);
    				} else {
    					i++;
    				}
    			}
    			// no more handlers?
    			if (!handlers.length) {
    				delete othersEvents.events[eventName];
    			}
    		}
    		if (isEmptyObject(othersEvents.events)) {
    			delete idedEvents[cid];
    		}
    	}
    	return this;
    }

};

// add aliases
/**
 * @function can-event.bind bind
 * @parent can-event.static
 * @signature `obj.bind(event, handler)`
 *
 * Add a basic event listener to an object.
 *
 * This is an alias of [can-event.addEventListener addEventListener].
 *
 * @signature `canEvent.bind.call(obj, event, handler)`
 *
 * This syntax can be used for objects that don't include the [can-event] mixin.
 */
canEvent.addEvent = canEvent.bind = function(){
    // Use a wrapping function so `addEventListener`'s behavior can change.
    return canEvent.addEventListener.apply(this, arguments);
};
/**
 * @function can-event.unbind unbind
 * @parent can-event.static
 * @signature `obj.unbind(event, handler)`
 *
 * Removes a basic event listener from an object.
 *
 * This is an alias of [can-event.removeEventListener removeEventListener].
 *
 * @signature `canEvent.unbind.call(obj, event, handler)`
 *
 * This syntax can be used for objects that don't include the [can-event] mixin.
 */
canEvent.unbind =  canEvent.removeEvent = function(){
    return canEvent.removeEventListener.apply(this, arguments);
};
/**
 * @function can-event.delegate delegate
 * @parent can-event.static
 * @signature `obj.delegate(selector, event, handler)`
 *
 * Provides a compatibility layer for adding delegate event listeners.
 * This doesn't actually implement delegates, but rather allows
 * logic that assumes a delegate to still function.
 *
 * Therefore, this is essentially an alias of [can-event.addEventListener addEventListener] with the selector ignored.
 *
 * @param {String} selector The **ignored** selector to use for the delegate.
 * @param {String} event The name of the event to listen for.
 * @param {Function} handler The handler that will be executed to handle the event.
 * @return {Object} this
 *
 * @signature `canEvent.delegate.call(obj, selector, event, handler)`
 *
 * This syntax can be used for objects that don't include the [can.event] mixin.
 */
canEvent.delegate = canEvent.on;

/**
 * @function can-event.undelegate undelegate
 * @parent can-event.static
 * @signature `obj.undelegate(selector, event, handler)`
 *
 * Provides a compatibility layer for removing delegate event listeners.
 * This doesn't actually implement delegates, but rather allows
 * logic that assumes a delegate to still function.
 *
 * Therefore, this is essentially an alias of [can-event.removeEventListener removeEventListener] with the selector ignored.
 *
 * @param {String} selector The **ignored** selector to use for the delegate.
 * @param {String} event The name of the event to listen for.
 * @param {Function} handler The handler that will be executed to handle the event.
 * @return {Object} this
 *
 * @signature `canEvent.undelegate.call(obj, selector, event, handler)`
 *
 * This syntax can be used for objects that don't include the [can-event] mixin.
 */
canEvent.undelegate = canEvent.off;

canEvent.dispatch = canEvent.dispatchSync;



Object.defineProperty(canEvent, "makeHandlerArgs",{
    enumerable: false,
    value: makeHandlerArgs
});

Object.defineProperty(canEvent,"handlers", {
    enumerable: false,
    value: getHandlers
});
Object.defineProperty(canEvent,"flush", {
    enumerable: false,
    writable: true,
    value: function(){}
});

module.exports = namespace.event = canEvent;
