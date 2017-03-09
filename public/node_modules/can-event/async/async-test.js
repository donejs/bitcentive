var canEvent = require('can-event');
var QUnit = require('steal-qunit');
var assign = require('can-util/js/assign/assign');
var eventAsync = require("can-event/async/async");

require('can-util/dom/events/delegate/delegate');

QUnit.module('can-event/async',{
	setup: function(){
		eventAsync.async();
	},
	teardown: function(){
		eventAsync.sync();
	}
});

QUnit.asyncTest('removing an event handler, nothing called', 5, function () {
	var obj = {};

	assign(obj, canEvent);

	var handler = function (ev, arg1, arg2) {
		ok(true, 'foo called');
		equal(ev.type, 'foo');
		equal(arg1, 1, 'one');
		equal(arg2, 2, 'two');
	};

	obj.addEventListener('foo', handler);

	obj.dispatch({
		type: 'foo'
	}, [
		1,
		2
	]);

	obj.removeEventListener('foo', handler);

	obj.addEventListener('foo',function(){
		QUnit.ok(true, "this handler called");
		QUnit.start();
	});
	obj.dispatch({
		type: 'foo',
		data: [
			1,
			2
		]
	});

});

QUnit.asyncTest('removing an event handler, nothing called with on', 6, function () {
	var obj = {};

	assign(obj, canEvent);

	var dispatched = false;
	var handler = function (ev, arg1, arg2) {
		ok(dispatched, "dispatched should be async");
		ok(true, 'foo called');
		equal(ev.type, 'foo');
		equal(arg1, 1, 'one');
		equal(arg2, 2, 'two');
	};

	obj.on('foo', handler);

	obj.dispatch({
		type: 'foo'
	}, [
		1,
		2
	]);
	dispatched = true;

	obj.off('foo', handler);

	obj.on('foo',function(){
		QUnit.ok(true, "this handler called");
		QUnit.start();
	});
	obj.dispatch({
		type: 'foo',
		data: [
			1,
			2
		]
	});

});

QUnit.asyncTest("async with same batch number is fired right away", function(){
	var obj = assign({}, canEvent);
	var secondDispatched = false;
	var secondBatchNum;

	obj.on("first", function(ev){
		obj.dispatch({batchNum: ev.batchNum, type: "second"});
		equal(secondBatchNum, ev.batchNum, "batch nums the same");
		ok(secondDispatched, "dispatched event immediately");
		QUnit.start();
	});

	obj.on("second", function(ev){
		secondDispatched = true;
		secondBatchNum = ev.batchNum;
	});
	obj.dispatch("first");
});
