/* jshint asi:true */
/*jshint -W079 */
var Map = require('can-map');
var QUnit = require('steal-qunit');
var Observation = require('can-observation');
var Construct = require('can-construct');
var observeReader = require('can-observation/reader/reader');

QUnit.module('can-map');

test("Basic Map", 4, function () {

	var state = new Map({
		category: 5,
		productType: 4
	});

	state.bind("change", function (ev, attr, how, val, old) {
		equal(attr, "category", "correct change name");
		equal(how, "set");
		equal(val, 6, "correct");
		equal(old, 5, "correct");
	});

	state.attr("category", 6);

	state.unbind("change");

});

test("Nested Map", 5, function () {
	var me = new Map({
		name: {
			first: "Justin",
			last: "Meyer"
		}
	});

	ok(me.attr("name") instanceof Map);

	me.bind("change", function (ev, attr, how, val, old) {
		console.log(arguments);
		equal(attr, "name.first", "correct change name");
		equal(how, "set");
		equal(val, "Brian", "correct");
		equal(old, "Justin", "correct");
	});

	me.attr("name.first", "Brian");

	me.unbind("change");

});

test("remove attr", function () {
	var state = new Map({
		category: 5,
		productType: 4
	});
	state.removeAttr("category");
	deepEqual(Map.keys(state), ["productType"], "one property");
});

test("remove attr on key with dot", function () {
	var state = new Map({
		"key.with.dots": 12,
		productType: 4
	});
	var state2 = new Map({
		"key.with.dots": 4,
		key: {
			"with": {
				someValue: 20
			}
		}
	});
	state.removeAttr("key.with.dots");
	state2.removeAttr("key.with.someValue");
	deepEqual( Map.keys(state), ["productType"], "one property");
	deepEqual( Map.keys(state2), ["key.with.dots", "key"], "two properties");
	deepEqual( Map.keys( state2.key["with"] ) , [], "zero properties");
});

test("nested event handlers are not run by changing the parent property (#280)", function () {

	var person = new Map({
		name: {
			first: "Justin"
		}
	})
	person.bind("name.first", function (ev, newName) {
		ok(false, "name.first should never be called")
		//equal(newName, "hank", "name.first handler called back with correct new name")
	});
	person.bind("name", function () {
		ok(true, "name event triggered")
	})

	person.attr("name", {
		first: "Hank"
	});

});

test("cyclical objects (#521)", function () {

	var foo = {};
	foo.foo = foo;

	var fooed = new Map(foo);

	ok(true, "did not cause infinate recursion");

	ok(fooed.attr('foo') === fooed, "map points to itself")

	var me = {
		name: "Justin"
	}
	var references = {
		husband: me,
		friend: me
	}
	var ref = new Map(references)

	ok(ref.attr('husband') === ref.attr('friend'), "multiple properties point to the same thing")

})

test('_cid add to original object', function () {
	var map = new Map(),
		obj = {
			'name': 'thecountofzero'
		};

	map.attr('myObj', obj);
	ok(!obj._cid, '_cid not added to original object');
});

test("Map serialize triggers reading (#626)", function () {
	var old = Observation.add;

	var attributesRead = [];
	var readingTriggeredForKeys = false;

	Observation.add = function (object, attribute) {
		if (attribute === "__keys") {
			readingTriggeredForKeys = true;
		} else {
			attributesRead.push(attribute);
		}
	};

	var testMap = new Map({
		cats: "meow",
		dogs: "bark"
	});

	testMap.serialize();



	ok(attributesRead.indexOf("cats") !== -1 && attributesRead.indexOf("dogs") !== -1, "map serialization triggered __reading on all attributes");
	ok(readingTriggeredForKeys, "map serialization triggered __reading for __keys");

	Observation.add = old;
})

test("Test top level attributes", 7, function () {
	var test = new Map({
		'my.enable': false,
		'my.item': true,
		'my.count': 0,
		'my.newCount': 1,
		'my': {
			'value': true,
			'nested': {
				'value': 100
			}
		}
	});

	equal(test.attr('my.value'), true, 'correct');
	equal(test.attr('my.nested.value'), 100, 'correct');
	ok(test.attr("my.nested") instanceof Map);

	equal(test.attr('my.enable'), false, 'falsey (false) value accessed correctly');
	equal(test.attr('my.item'), true, 'truthey (true) value accessed correctly');
	equal(test.attr('my.count'), 0, 'falsey (0) value accessed correctly');
	equal(test.attr('my.newCount'), 1, 'falsey (1) value accessed correctly');
});


test("serializing cycles", function(){
	var map1 = new Map({name: "map1"});
	var map2 = new Map({name: "map2"});

	map1.attr("map2", map2);
	map2.attr("map1", map1);

	var res = map1.serialize();
	equal(res.name, "map1");
	equal(res.map2.name, "map2");
});

test("Unbinding from a map with no bindings doesn't throw an error (#1015)", function() {
	expect(0);

	var test = new Map({});

	try {
		test.unbind('change');
	} catch(e) {
		ok(false, 'No error should be thrown');
	}
});

test("Fast dispatch event still has target and type (#1082)", 4, function() {
	var data = new Map({
		name: 'CanJS'
	});

	data.bind('change', function(ev){
		equal(ev.type, 'change');
		equal(ev.target, data);
	});

	data.bind('name', function(ev){
		equal(ev.type, 'name');
		equal(ev.target, data);
	});

	data.attr('name', 'David');
});

test("map passed to Map constructor (#1166)", function(){
	var map = new Map({x: 1});
	var res = new Map(map);
	deepEqual(res.attr(), {
		x: 1
	}, "has the same properties");
});

test("constructor passed to scope is threated as a property (#1261)", function(){
	var Constructor = Construct.extend({});

	var MyMap = Map.extend({
	  Todo: Constructor
	});

	var m = new MyMap();

	equal(m.attr("Todo"), Constructor);
});

test('_bindings count maintained after calling .off() on undefined property (#1490) ', function () {

	var map = new Map({
		test: 1
	});

	map.on('test', function(){});

	equal(map._bindings, 1, 'The number of bindings is correct');

	map.off('undefined_property');

	equal(map._bindings, 1, 'The number of bindings is still correct');
});

test("Should be able to get and set attribute named 'watch' on Map in Firefox", function() {
	var map = new Map({});
	map.attr("watch");
	ok(true, "can have attribute named 'watch' on a Map instance");
});

test("Should be able to get and set attribute named 'unwatch' on Map in Firefox", function() {
	var map = new Map({});
	map.attr("unwatch");
	ok(true, "can have attribute named 'unwatch' on a Map instance");
});

test('should get an empty string property value correctly', function() {
	var map = new Map({
		foo: 'foo',
		'': 'empty string'
	});

	equal(map.attr(''), 'empty string');
});


test("ObserveReader - can.Construct derived classes should be considered objects, not functions (#450)", function() {
	var foostructor = Map.extend({ text: "bar" }, {}),
		obj = {
			next_level: {
				thing: foostructor,
				text: "In the inner context"
			}
		},
		read;
	foostructor.self = foostructor;

	read = observeReader.read(obj, observeReader.reads("next_level.thing.self.text") );
	equal(read.value, "bar", "static properties on a can.Construct-based function");

	read = observeReader.read(obj, observeReader.reads("next_level.thing.self"), { isArgument: true });
	ok(read.value === foostructor, "arguments shouldn't be executed");

	foostructor.self = function() { return foostructor; };
	read = observeReader.read(obj, observeReader.reads("next_level.thing.self.text"), { });
	equal(read.value, "bar", "anonymous functions in the middle of a read should be executed if requested");
});

test("Basic Map.prototype.compute", function () {

	var state = new Map({
		category: 5,
		productType: 4
	});
	var catCompute = state.compute('category');
	var prodCompute = state.compute('productType');

	catCompute.bind("change", function (ev, val, old) {
		equal(val, 6, "correct");
		equal(old, 5, "correct");
	});

	state.bind('productType', function(ev, val, old) {
		equal(val, 5, "correct");
		equal(old, 4, "correct");
	});

	state.attr("category", 6);
	prodCompute(5);

	catCompute.unbind("change");
	state.unbind("productType");

});

test("Deep Map.prototype.compute", function () {

	var state = new Map({
		product: {
			category: 5,
			productType: 4
		}
	});
	var catCompute = state.compute('product.category');
	var prodCompute = state.compute('product.productType');

	catCompute.bind("change", function (ev, val, old) {
		equal(val, 6, "correct");
		equal(old, 5, "correct");
	});

	state.attr('product').bind('productType', function(ev, val, old) {
		equal(val, 5, "correct");
		equal(old, 4, "correct");
	});

	state.attr("product.category", 6);
	prodCompute(5);

	catCompute.unbind("change");
	state.unbind("productType");

});
