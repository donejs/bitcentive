var canEvent = require('can-event');
/**
 * @typedef {{bind:function():*,unbind:function():*}} can.util.bind
 *
 * Provides mixin-able bind and unbind methods. `bind()` calls `this._bindsetup`
 * when the first bind happens and.  `unbind()` calls `this._bindteardown` when there
 * are no more event handlers.
 *
 */
	// ## Bind helpers

var lifecycle = function(prototype) {
	var baseAddEventListener = prototype.addEventListener;
	var baseRemoveEventListener = prototype.removeEventListener;

	prototype.addEventListener = function () {
		// Add the event to this object
		var ret = baseAddEventListener.apply(this, arguments);
		// If not initializing, and the first binding
		// call bindsetup if the function exists.
		if (!this.__inSetup) {
			if (!this._bindings) {
				this._bindings = 1;
				// setup live-binding
				if (this._eventSetup) {
					this._eventSetup();
				}
			} else {
				this._bindings++;
			}
		}
		return ret;
	};

	prototype.removeEventListener = function (event, handler) {
		if (!this.__bindEvents) {
			return this;
		}

		var handlers = this.__bindEvents[event] || [];
		var handlerCount = handlers.length;

		// Remove the event handler
		var ret = baseRemoveEventListener.apply(this, arguments);
		if (this._bindings === null) {
			this._bindings = 0;
		} else {
			// Subtract the difference in the number of handlers bound to this
			// event before/after removeEvent
			this._bindings = this._bindings - (handlerCount - handlers.length);
		}
		// If there are no longer any bindings and
		// there is a bindteardown method, call it.
		if (!this._bindings && this._eventTeardown) {
			this._eventTeardown();
		}
		return ret;
	};

	return prototype;
};

var baseEvents = lifecycle({
	addEventListener: canEvent.addEventListener,
	removeEventListener: canEvent.removeEventListener
});

lifecycle.addAndSetup = baseEvents.addEventListener;
lifecycle.removeAndTeardown = baseEvents.removeEventListener;

module.exports = lifecycle;
