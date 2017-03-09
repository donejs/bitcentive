var canEvent = require('can-event');
var lifecycle = require('can-event/lifecycle/lifecycle');
var QUnit = require('steal-qunit');

QUnit.module("can-event/lifecycle");

QUnit.test("Mixins your addEventListener", function(){
	var proto = {
		addEventListener: function(){
			QUnit.ok(true, "this was called");
		},
		removeEventListener: function(){}
	};

	var obj = lifecycle(proto);
	obj.addEventListener("Hello world!");
});

QUnit.test("Mixins your removeEventListener", function(){
	var proto = {
		removeEventListener: function(){
			QUnit.ok(true, "this was called");
		},
		addEventListener: canEvent.addEventListener
	};

	var obj = lifecycle(proto);
	obj.addEventListener("some-event");
	obj.removeEventListener("some-event");
});

QUnit.test("Calls _eventSetup on the first addEventListener", function(){
	var proto = {
		_eventSetup: function(){
			QUnit.ok(true, "eventSetup was called");
		},
		addEventListener: function(){},
		removeEventListener: function(){}
	};

	var obj = lifecycle(proto);
	obj.addEventListener("Something");
});

QUnit.test("Calls _eventTeardown on the last removeEventListener", function(){
	var proto = {
		_eventTeardown: function(){
			QUnit.ok(true, "eventTeardown was called");
		},
		addEventListener: canEvent.addEventListener,
		removeEventListener: canEvent.removeEventListener
	};

	var obj = lifecycle(proto);
	var handler = function(){};
	obj.addEventListener("Something", handler);
	obj.removeEventListener("Something", handler);
});
