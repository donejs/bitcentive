"use strict";
var Scope = require('can-view-scope');
var DefineMap = require('can-define/map/map');
var DefineList = require('can-define/list/list');
var observeReader = require('can-observation/reader/reader');
var compute = require('can-compute');

var QUnit = require('steal-qunit');

QUnit.module('can-view-scope with define');

test("basics",function(){

	var items = new DefineMap({ people: [{name: "Justin"},{name: "Brian"}], count: 1000 });

	var itemsScope = new Scope(items),
	arrayScope = new Scope(itemsScope.peek("people"), itemsScope),
	firstItem = new Scope( arrayScope.peek('0'), arrayScope );

	var nameInfo;
	var c = compute(function(){
		nameInfo = firstItem.read('name');
	});
	c.bind("change", function(){});
	deepEqual(nameInfo.reads, [{key: "name", at: false}], "reads");
	equal(nameInfo.scope, firstItem, "scope");
	equal(nameInfo.value,"Justin", "value");
	equal(nameInfo.rootObserve, items.people[0], "rootObserve");

});

test('Scope.prototype.computeData', function () {
	var map = new DefineMap({age: undefined});
	var base = new Scope(map);
	var age = base.computeData('age')
		.compute;
	equal(age(), undefined, 'age is not set');
	age.bind('change', function (ev, newVal, oldVal) {
		equal(newVal, 31, 'newVal is provided correctly');
		equal(oldVal, undefined, 'oldVal is undefined');
	});
	age(31);
	equal(map.age, 31, 'maps age is set correctly');
});
test('backtrack path (#163)', function () {
	var row = new DefineMap({
		first: 'Justin'
	}),
		col = {
			format: 'str'
		}, base = new Scope(row),
		cur = base.add(col);
	equal(cur.peek('.'), col, 'got col');
	equal(cur.peek('..'), row, 'got row');
	equal(cur.peek('../first'), 'Justin', 'got row');
});

test('nested properties with compute', function () {
	var me = new DefineMap({
		name: {
			first: 'Justin'
		}
	});
	var cur = new Scope(me);
	var compute = cur.computeData('name.first')
		.compute;
	var changes = 0;
	compute.bind('change', function (ev, newVal, oldVal) {
		if (changes === 0) {
			equal(oldVal, 'Justin');
			equal(newVal, 'Brian');
		} else if (changes === 1) {
			equal(oldVal, 'Brian');
			equal(newVal, undefined);
		} else if (changes === 2) {
			equal(oldVal, undefined);
			equal(newVal, 'Payal');
		} else if (changes === 3) {
			equal(oldVal, 'Payal');
			equal(newVal, 'Curtis');
		}
		changes++;
	});
	equal(compute(), 'Justin', 'read value after bind');
	me.name.first = 'Brian';
	me.name = undefined;
	me.name = {
		first: 'Payal'
	};
	me.name = new DefineMap({
		first: 'Curtis'
	});
});

test('binds to the right scope only', 3,function () {
	var baseMap = new DefineMap({
		me: {
			name: {
				first: 'Justin'
			}
		}
	});
	var base = new Scope(baseMap);
	var topMap = new DefineMap({
		me: {
			name: {}
		}
	});
	var scope = base.add(topMap);
	var compute = scope.computeData('me.name.first')
		.compute;
	compute.bind('change', function (ev, newVal, oldVal) {
		equal(oldVal, 'Justin');
		equal(newVal, 'Brian');
	});
	equal(compute(), 'Justin');
	// this should do nothing

	baseMap.me.name.first = 'Brian';
});

test('Scope read returnObserveMethods=true', function () {
	var MapConstruct = DefineMap.extend({
		foo: function (arg) {
			equal(this, data.map, 'correct this');
			equal(arg, true, 'correct arg');
		}
	});
	var data = {
		map: new MapConstruct()
	};
	var res = Scope.read(data, observeReader.reads('map.foo'), {
		isArgument: true
	});
	res.value(true);
});

test('rooted observable is able to update correctly', function () {
	var baseMap = new DefineMap({
		name: {
			first: 'Justin'
		}
	});
	var scope = new Scope(baseMap);
	var compute = scope.computeData('name.first')
		.compute;
	equal(compute(), 'Justin');
	baseMap.name = new DefineMap({
		first: 'Brian'
	});

	equal(compute(), 'Brian');
});


test('Can read static properties on constructors (#634)', function () {
	var Foo = DefineMap.extend( {
		static_prop: 'baz'
	}, {
		proto_prop: 'thud'
	});
	var data = new Foo({
		own_prop: 'quux'
	}),
		scope = new Scope(data);
	equal(scope.computeData('constructor.static_prop')
		.compute(), 'baz', 'static prop');
});


test("setting props in a compute (#18)", function(){
	var map = new DefineMap({complete: true});
	var computeVal = compute(map);

	var base = new Scope(computeVal);
	var complete = base.computeData('complete')
		.compute;
	equal(complete(), true, 'can read the value')

	complete(false);

	QUnit.equal( map.complete, false, "value set");
});

test("undefined DefineMap props should be a scope hit (#20)", function(){

	var MyType = DefineMap.extend("MyType",{
		value: "string"
	});
	var EmptyType = DefineMap.extend("EmptyType",{});

	var instance = new MyType();

	var scope = new Scope(instance).add(new EmptyType());

	var c1 = scope.computeData("value").compute;
	c1.on("change", function(){});
	c1("BAR");

	QUnit.equal(instance.value, "BAR");

	var instance2 = new MyType();
	var scope2 = new Scope(instance2).add(compute());
	var c2 = scope2.computeData("value").compute;
	c2.on("change", function(){});
	c2("BAR");

	QUnit.equal(instance2.value, "BAR");

});


test("that .set with ../ is able to skip notContext scopes (#43)", function(){
	var instance = new DefineMap({prop: 0});
	var notContextContext = {NAME: "NOT CONTEXT"};
	var top = {NAME: "TOP"};
	var scope = new Scope(instance).add(notContextContext,{notContext: true}).add(top);


	scope.set("../prop",1);

	QUnit.equal( instance.prop, 1);
});
