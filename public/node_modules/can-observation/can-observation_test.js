//require("./can-observation-async-test");
//require("./reader/reader_test");
var simple = require("./test/simple");
var simpleObservable = simple.observable;
var simpleCompute = simple.compute;

var Observation = require('can-observation');
var QUnit = require('steal-qunit');
var CID = require('can-cid');

var assign = require("can-util/js/assign/assign");
var canEvent = require('can-event');
var canBatch = require("can-event/batch/batch");
var eventAsync = require("can-event/async/async");
var clone = require("steal-clone");

QUnit.module('can-observation',{
	setup: function(){
		eventAsync.sync();
	}
});



QUnit.test('nested traps are reset onto parent traps', function() {
    var obs1 = assign({}, canEvent);
    CID(obs1);
    var obs2 = assign({}, canEvent);
    CID(obs2);

	var oi = new Observation(function() {

		var getObserves1 = Observation.trap();

		Observation.add(obs1, "prop1");

		var getObserves2 = Observation.trap();
		Observation.add(obs2, "prop2");

		var observes2 = getObserves2();

		Observation.addAll(observes2);

		var observes1 = getObserves1();

		equal(observes1.length, 2, "two items");
		equal(observes1[0].obj, obs1);
		equal(observes1[1].obj, obs2);
	}, null, function() {

	});

	oi.start();
});


test("Change propagation in a batch with late bindings (#2412)", function(){

	var rootA = simpleObservable('a');
	var rootB = simpleObservable('b');

	var childA = simpleCompute(function() {
		return "childA"+rootA.get();
	},'childA');

	var grandChild = simpleCompute(function() {

		var b = rootB.get();
		if (b === "b") {
			return "grandChild->b";
		}

		var a = childA();
		return "grandChild->"+a;
	},'grandChild');

	childA.addEventListener('change', function(ev, newVal, oldVal) {});

	grandChild.addEventListener('change', function(ev, newVal, oldVal) {
	  equal(newVal, "grandChild->childAA");
	});

	canBatch.start();
	rootA.set('A');
	rootB.set('B');
	canBatch.stop();

});

test("deeply nested computes that are read that don't allow deeper primary depth computes to complete first", function(){

	// This is to setup `grandChild` which will be forced
	// into reading `childA` which has a higher depth then itself, but isn't changing.
	// This makes sure that it will get a value for childA before
	// continuing on to deeper "primary depth" computes (things that are nested in stache).
	var rootA = simpleObservable('a');
	var rootB = simpleObservable('b');

	var childA = simpleCompute(function() {
		return "childA"+rootA.get();
	},'childA');

	var grandChild = simpleCompute(function() {
		if(rootB.get() === 'b') {
			return 'grandChild->b';
		}
		return childA();
	},'grandChild');

	// this should update last
	var deepThing = simpleCompute(function(){
		return rootB.get();
	},"deepThing", 4);

	var order = [];

	childA.addEventListener("change", function(){});

	deepThing.addEventListener("change", function(ev){
		order.push("deepThing");
	});

	grandChild.addEventListener("change", function(ev, newVal){
		order.push("grandChild "+newVal);
	});


	canBatch.start();
	rootB.set('B');
	canBatch.stop();


	QUnit.deepEqual(order, ["grandChild childAa","deepThing"]);

});

test("Reading a compute before the batch has completed", function(){
	var c1 = simpleObservable(1),
		c2;
	c1.on("value", function(){
		equal(c2(),4, "updated");
	});

	c2 = simpleCompute(function(){
		return c1.get() * c1.get();
	});

	c2.on("change", function(){});
	c1.set(2);
});

/*
test("a low primary depth reading a high primary depth compute", function(){
	var order = [];

	var rootB = simpleObservable('b');

	// this should update last
	var deepThing = simpleCompute(function(){
		return rootB.get();
	},"deepThing", 4);

	var grandChild = simpleCompute(function() {
		if(rootB.get() === 'b') {
			return 'grandChild->b';
		}
		return Observation.ignore(function(){
			return deepThing();
		})();

	},'grandChild');

	deepThing.addEventListener("change", function(ev){
		order.push("deepThing");
	});

	grandChild.addEventListener("change", function(ev, newVal){
		QUnit.equal(newVal, "B", "val is updated");
		order.push("grandChild");
	});



	canBatch.start();
	rootB.set('B');
	canBatch.stop();

	QUnit.deepEqual(order, ["grandChild","deepThing"]);
});*/


QUnit.test("canBatch.afterPreviousEvents in a compute", function(){
	var root = simpleObservable('a');

	var baseCompute = simpleCompute(function(){
		return root.get();
	},'baseCompute');

	var compute = simpleCompute(function(){
		// this base compute read is here just to flush the event queue.
		// and create no place for `afterPreviousEvents` to do anything.
		baseCompute();

		// now when this gets added ... it's going to create its own
		// batch which will call `Observation.updateAndNotify`
		canBatch.afterPreviousEvents(function(){});
		return root.get();
	},"afterPreviousCompute");

	compute.addEventListener("change", function(ev, newVal){
		QUnit.equal(newVal, "b");
	});

	root.set("b");
});

QUnit.test("prevent side compute reads (canjs/canjs#2151)", function(){
	var root = simpleObservable('a');
	var unchangingRoot = simpleObservable('X');
	var order = [];

	// A compute that will flush the event queue.
	var pushSidewaysCompute = simpleCompute(function(){
		return unchangingRoot.get();
	},'baseCompute');

	// A compute that should evaluate after computeThatGoesSideways
	var sideCompute = simpleCompute(function(){
		order.push('side compute');
		pushSidewaysCompute();
		return root.get();
	},'sideCompute');

	var dummyObject = assign({}, canEvent);
	dummyObject.on("dummyEvent", function(){});

	var computeThatGoesSideways = simpleCompute(function(){

		order.push('computeThatGoesSideways start');

		// Flush the event queue
		pushSidewaysCompute();

		// Dispatch a new event, which creates a new queue.
		// This should not cause `sideCompute` to re-run.
		dummyObject.dispatch("dummyEvent");

		order.push('computeThatGoesSideways finish');
		return root.get();
	},"computeThatGoesSideways");

	sideCompute.addEventListener("change", function(ev, newVal){});

	computeThatGoesSideways.addEventListener("change", function(ev, newVal){});


	order = [];
	root.set("b");

	QUnit.deepEqual(order, ['computeThatGoesSideways start', 'computeThatGoesSideways finish', 'side compute']);
});


QUnit.test("flush can mean  (canjs/canjs#2151)", function(){
	var root = simpleObservable('a');
	var unchangingRoot = simpleObservable('X');
	var order = [];

	// A compute that will flush the event queue.
	var pushSidewaysCompute = simpleCompute(function(){
		return unchangingRoot.get();
	},'baseCompute');

	// A compute that should evaluate after computeThatGoesSideways
	var sideCompute = simpleCompute(function(){
		order.push('side compute');
		pushSidewaysCompute();
		return root.get();
	},'sideCompute');

	var dummyObject = assign({}, canEvent);
	dummyObject.on("dummyEvent", function(){});

	var computeThatGoesSideways = simpleCompute(function(){

		order.push('computeThatGoesSideways start');

		// Flush the event queue
		pushSidewaysCompute();

		// Dispatch a new event, which creates a new queue.
		// This should not cause `sideCompute` to re-run.
		dummyObject.dispatch("dummyEvent");

		order.push('computeThatGoesSideways finish');
		return root.get();
	},"computeThatGoesSideways");

	sideCompute.addEventListener("change", function(ev, newVal){});

	computeThatGoesSideways.addEventListener("change", function(ev, newVal){});


	order = [];
	root.set("b");

	QUnit.deepEqual(order, ['computeThatGoesSideways start', 'computeThatGoesSideways finish', 'side compute']);
});

QUnit.test("it's possible canBatch.after is called before observations are updated", 4, function(){
	var afterCalled, afterUpdateAndNotifyCalled;
	var rootA = simpleObservable('a');
	var rootB = simpleObservable('b');

	var leftCompute = simpleCompute(function(){
		return rootA.get();
	},'leftCompute');

	var rightCompute = simpleCompute(function(){
		return rootB.get();
	},'rightCompute');


	leftCompute.addEventListener("change", function(){
		canBatch.start();

		rootB.set("B");

		canBatch.after(function(){
			afterCalled = true;
			QUnit.ok(true, "after is called");
		});
		Observation.afterUpdateAndNotify(function(){
			afterUpdateAndNotifyCalled = true;
			QUnit.ok(true, "afterUpdateAndNotify is called");
		});

		canBatch.stop();

		// this is the same as reading a compute
		canBatch.flush();
	});

	rightCompute.addEventListener("change", function(){
		QUnit.ok(afterCalled, "after can be called");
		QUnit.ok(!afterUpdateAndNotifyCalled, "afterUpdateAndNotifyCalled not called yet");
	});

	rootA.set("A");
});

QUnit.test("calling a deep compute when only its child should have been updated (#19)", 2, function(){

	// the problem is that childCompute knows it needs to change
	// but we are reading grandChildCompute.
	var rootA = simpleObservable('a');
	var sideObservable = simpleObservable('x');

	var sideCompute = simpleCompute(function(){
		return sideObservable.get();
	});

	var childCompute = simpleCompute(function(){
		return "c-"+rootA.get();
	},'childCompute');
	childCompute.addEventListener("change", function(){});

	var grandChildCompute = simpleCompute(function(){
		return "gc-"+childCompute();
	});
	grandChildCompute.addEventListener("change", function(ev, newValue){
		QUnit.equal(newValue, "gc-c-B", "one change event");
	});

	sideCompute.addEventListener("change", function(){
		rootA.set("B");
		QUnit.equal( grandChildCompute(), "gc-c-B", "read new value");
	});

	sideObservable.set("X");


});

QUnit.test('should throw if can-namespace.Observation is already defined', function() {
	stop();
	clone({
		'can-namespace': {
			default: {
				Observation: {}
			},
			__useDefault: true
		}
	})
	.import('can-observation')
	.then(function() {
		ok(false, 'should throw');
		start();
	})
	.catch(function(err) {
		ok(err && err.message.indexOf('can-observation') >= 0, 'should throw an error about can-observation');
		start();
	});
});
