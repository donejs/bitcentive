var canEvent = require('can-event');
var QUnit = require('steal-qunit');
var assign = require('can-util/js/assign/assign');
var canBatch = require("can-event/batch/batch");
var eventAsync = require("can-event/async/async");

require('can-util/dom/events/delegate/delegate');

QUnit.module('can-event/batch',{
	setup: function(){
		eventAsync.sync();
	},
	teardown: function(){
		eventAsync.async();
	}
});

QUnit.test("basics", function(){
	var collecting;
	var secondFired = false;
	var obj = assign({}, canEvent);
	obj.on("first", function(ev, arg1, arg2){
		QUnit.equal(collecting.number, ev.batchNum, "same batch num");
		QUnit.equal(canBatch.dispatching(), collecting, "dispatching old collecting");
		QUnit.equal(arg1, 1, "first arg");
		QUnit.equal(arg2, 2, "second arg");

		collecting = canBatch.collecting();
		QUnit.ok(!collecting, "not collecting b/c we're not in a batch yet");
		obj.dispatch("second");
		collecting = canBatch.collecting();
		QUnit.ok(collecting, "forced a batch");
		QUnit.equal(secondFired, false, "don't fire yet, put in next batch");

	});


	obj.on("second", function(ev){
		secondFired = true;
		QUnit.equal(collecting.number, ev.batchNum, "same batch num on second");
		QUnit.equal(canBatch.dispatching(), collecting, "dispatching second collecting");
	});

	canBatch.start();
	collecting = canBatch.collecting();
	QUnit.ok(canBatch.collecting(), "is collecting");
	obj.dispatch("first",[1,2]);
	canBatch.stop();


});

QUnit.test("events are queued and dispatched without .stop being called (#14)", function(){
	var obj = assign({}, canEvent);


	obj.on("first", function(ev){
		obj.dispatch("second");
		QUnit.ok(canBatch.collecting() !== canBatch.dispatching(), "dispatching is not collecting");
	});

	obj.on("second", function(){
		QUnit.ok(canBatch.collecting() !== canBatch.dispatching(), "dispatching is not collecting");
		QUnit.ok(true, "called");
	});

	canBatch.start();
	obj.dispatch("first");
	canBatch.stop();
});

test("Everything is part of a batch", function(){
	var obj = {};
	assign(obj, canEvent);

	obj.on("foo", function(ev){
		ok(ev.batchNum); // There is a batch number
	});

	obj.dispatch("foo");
});

test("batch.queue callback called after events fired in the same fn", function(){
	var obj = assign({}, canEvent);

	var thirdCalled = false, firstBatch;
	obj.on("third",function(ev){
		QUnit.equal( firstBatch, ev.batchNum, "third is right");
		thirdCalled = true;
	});

	obj.on("first", function(ev){
		equal(typeof ev.batchNum, "number", "got a batch number");
		firstBatch = ev.batchNum;
		canBatch.queue([function(){
			equal(thirdCalled, true, "third called before this");
		}, null, []]);

		obj.dispatch({type: "third", batchNum: ev.batchNum});
	});

	obj.dispatch("first");
});


QUnit.test("afterPreviousEvents doesn't run after all collecting previous events (#17)", function(){
	var obj = assign({}, canEvent);
	var afterPreviousEventsFired = false;
	obj.on("first", function(){
		QUnit.ok(!afterPreviousEventsFired, "after previous should fire after");
	});

	canBatch.start();
	obj.dispatch("first");
	canBatch.afterPreviousEvents(function(){
		afterPreviousEventsFired = true;
	});
	canBatch.stop();
});


QUnit.test("flushing works (#18)", function(){
	var firstFired, secondFired, thirdFired;
	var obj = assign({}, canEvent);

	obj.on("first", function(){
		canBatch.flush();
		QUnit.ok(firstFired, "first fired");
		QUnit.ok(secondFired, "second fired");
		QUnit.ok(thirdFired, "third fired");
	});
	obj.on("first", function(){
		firstFired = true;
	});
	obj.on("second", function(){
		secondFired = true;
	});
	obj.on("third", function(){
		thirdFired = true;
	});
	canBatch.start();
	obj.dispatch("first");
	obj.dispatch("second");
	obj.dispatch("third");
	canBatch.stop();

});


QUnit.test("flush is non enumerable (#18)", 1, function(){
	QUnit.equal( canEvent.flush, canBatch.flush );
	for(var prop in canEvent) {
		if(prop === "flush") {
			ok(false, "flush is enumerable");
		}
	}
});

// The problem with the way atm is doing it ...
// the batch is ended ... but it doesn't pick up the next item in the queue and process it.
QUnit.test("flushing a future batch (#18)", function(){
	var firstFired, secondFired, thirdFired;
	var obj = assign({}, canEvent);

	obj.on("first", function(){
		canBatch.start();
		obj.dispatch("second");
		obj.dispatch("third");
		canBatch.stop();

		canBatch.flush();
		QUnit.ok(firstFired, "first fired");
		QUnit.ok(secondFired, "second fired");
		QUnit.ok(thirdFired, "third fired");
	});
	obj.on("first", function(){
		firstFired = true;
	});
	obj.on("second", function(){
		secondFired = true;
	});
	obj.on("third", function(){
		thirdFired = true;
	});
	canBatch.start();
	obj.dispatch("first");
	canBatch.stop();

});
