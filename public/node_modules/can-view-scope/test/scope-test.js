require("./scope-define-test");
var Scope = require('can-view-scope');
var Map = require('can-map');
require('can-list');
var observeReader = require('can-observation/reader/reader');
var compute = require('can-compute');
var ReferenceMap = require('../reference-map');

var QUnit = require('steal-qunit');

QUnit.module('can/view/scope');

test("basics",function(){

	var items = new Map({ people: [{name: "Justin"},[{name: "Brian"}]], count: 1000 });

	var itemsScope = new Scope(items),
	arrayScope = new Scope(itemsScope.peek('people'), itemsScope),
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
	var map = new Map();
	var base = new Scope(map);
	var age = base.computeData('age')
		.compute;
	equal(age(), undefined, 'age is not set');
	age.bind('change', function (ev, newVal, oldVal) {
		equal(newVal, 31, 'newVal is provided correctly');
		equal(oldVal, undefined, 'oldVal is undefined');
	});
	age(31);
	equal(map.attr('age'), 31, 'maps age is set correctly');
});
test('backtrack path (#163)', function () {
	var row = new Map({
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
	var me = new Map({
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
	me.attr('name.first', 'Brian');
	me.removeAttr('name');
	me.attr('name', {
		first: 'Payal'
	});
	me.attr('name', new Map({
		first: 'Curtis'
	}));
});
test('function at the end', function () {
	var compute = new Scope({
		me: {
			info: function () {
				return 'Justin';
			}
		}
	})
		.computeData('me.info')
		.compute;
	equal(compute(), 'Justin');
	var fn = function () {
		return this.name;
	};
	var compute2 = new Scope({
		me: {
			info: fn,
			name: 'Hank'
		}
	})
		.computeData('me.info', {
			isArgument: true,
			args: []
		})
		.compute;
	equal(compute2()(), 'Hank');
});
test('binds to the right scope only', function () {
	var baseMap = new Map({
		me: {
			name: {
				first: 'Justin'
			}
		}
	});
	var base = new Scope(baseMap);
	var topMap = new Map({
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
	topMap.attr('me.name.first', 'Payal');
	baseMap.attr('me.name.first', 'Brian');
});
test('Scope read returnObserveMethods=true', function () {
	var MapConstruct = Map.extend({
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
	var baseMap = new Map({
		name: {
			first: 'Justin'
		}
	});
	var scope = new Scope(baseMap);
	var compute = scope.computeData('name.first')
		.compute;
	equal(compute(), 'Justin');
	baseMap.attr('name', new Map({
		first: 'Brian'
	}));
	equal(compute(), 'Brian');
});
test('computeData reading an object with a compute', function () {
	var sourceAge = 21;

	var age = compute(function (newVal) {
		if (newVal) {
			sourceAge = newVal;
		} else {
			return sourceAge;
		}
	});

	var scope = new Scope({
		person: {
			age: age
		}
	});

	var computeData = scope.computeData('person.age');
	var value = computeData.compute();

	equal(value, 21, 'correct value');

	computeData.compute(31);
	equal(age(), 31, 'age updated');
});
test('computeData with initial empty compute (#638)', function () {
	expect(2);
	var c = compute();
	var scope = new Scope({
		compute: c
	});
	var computeData = scope.computeData('compute');
	equal(computeData.compute(), undefined);
	computeData.compute.bind('change', function (ev, newVal) {
		equal(newVal, 'compute value');
	});
	c('compute value');
});

test('Can read static properties on constructors (#634)', function () {
	var Foo = Map.extend( {
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

test("Can read static properties on constructors (#634)", function () {
	var Foo = Map.extend({
		static_prop: "baz"
	}, {
		proto_prop: "thud"
	});
	var data = new Foo({
		own_prop: "quux"
	}),
		scope = new Scope(data);

	equal(scope.computeData("constructor.static_prop")
		.compute(), "baz", "static prop");
});

test('Scope lookup restricted to current scope with ./ (#874)', function() {
	var current;
	var scope = new Scope(
			new Map({value: "A Value"})
		).add(
			current = new Map({})
		);

	var compute = scope.computeData('./value').compute;

	equal(compute(), undefined, "no initial value");


	compute.bind("change", function(ev, newVal){
		equal(newVal, "B Value", "changed");
	});

	compute("B Value");
	equal(current.attr("value"), "B Value", "updated");

});

test('reading properties on undefined (#1314)', function(){

	var scope = new Scope(undefined);

	var compute = scope.compute("property");

	equal(compute(), undefined, "got back undefined");

});


test("Scope attributes can be set (#1297, #1304)", function(){
	var comp = compute('Test');
	var map = new Map({
		other: {
			name: "Justin"
		}
	});
	var scope = new Scope({
		name: "Matthew",
		other: {
			person: {
				name: "David"
			},
			comp: comp
		}
	});

	scope.set("name", "Wilbur");
	equal(scope.get("name"), "Wilbur", "Value updated");

	scope.set("other.person.name", "Dave");
	equal(scope.get("other.person.name"), "Dave", "Value updated");

	scope.set("other.comp", "Changed");
	equal(comp(), "Changed", "Compute updated");

	scope = new Scope(map);
	scope.set("other.name", "Brian");

	equal(scope.get("other.name"), "Brian", "Value updated");
	equal(map.attr("other.name"), "Brian", "Name update in map");
});

test("computeData.compute get/sets computes in maps", function(){
	var cmpt = compute(4);
	var map = new Map();
	map.attr("computer", cmpt);

	var scope = new Scope(map);
	var computeData = scope.computeData("computer",{});

	equal( computeData.compute(), 4, "got the value");

	computeData.compute(5);
	equal(cmpt(), 5, "updated compute value");
	equal( computeData.compute(), 5, "the compute has the right value");
});

test("computesData can find update when initially undefined parent scope becomes defined (#579)", function(){
	expect(2);

	var map = new Map();
	var scope = new Scope(map);
	var top = scope.add(new Map());

	var computeData = top.computeData("value",{});

	equal( computeData.compute(), undefined, "initially undefined");

	computeData.compute.bind("change", function(ev, newVal){
		equal(newVal, "first");
	});

	map.attr("value","first");


});

test("A scope's %root is the last context", function(){
	var map = new Map();
	var refs = Scope.refsScope();
	// Add a bunch of contexts onto the scope, we want to make sure we make it to
	// the top.
	var scope = refs.add(map).add(new Scope.Refs()).add(new Map());

	var root = scope.peek("%root");

	ok(!(root instanceof Scope.Refs), "root isn't a reference");
	equal(root, map, "The root is the map passed into the scope");
});

test("can set scope attributes with ../ (#2132)", function(){

	var map = new Map();
	var scope = new Scope(map);
	var top = scope.add(new Map());

	top.set("../foo", "bar");

	equal(map.attr("foo"), "bar");

});

test("can read parent context with ../ (#2244)", function(){
	var map = new Map();
	var scope = new Scope(map);
	var top = scope.add(new Map());

	equal( top.peek("../"), map, "looked up value correctly");

});

test("trying to read constructor from refs scope is ok", function(){
	var map = new ReferenceMap();
	var construct = compute(function(){
		return map.attr("constructor");
	});
	construct.bind("change", function(){});
	equal(construct(), ReferenceMap);
});

test("reading from a string in a nested scope doesn't throw an error (#22)",function(){
	var foo = compute('foo');
	var bar = compute('bar');
	var scope = new Scope(foo);
	var localScope = scope.add(bar);

	equal(localScope.read('foo').value, undefined);
});

test("Optimize for compute().observableProperty (#29)", function(){
	var map = new Map({value: "a"});
	var wrap = compute(map);

	var scope = new Scope(wrap);

	var scopeCompute = scope.compute("value");

	var changeNumber = 0;
	scopeCompute.on("change", function(ev, newVal, oldVal){
		if(changeNumber === 1) {
			QUnit.equal(newVal, "b");
			QUnit.equal(oldVal, "a");
			QUnit.ok(scopeCompute.fastPath, "still fast path");
			changeNumber++;
			wrap(new Map({value: "c"}));
		} else if(changeNumber === 2) {
			QUnit.equal(newVal, "c", "got new value");
			QUnit.equal(oldVal, "b", "got old value");
			QUnit.notOk(scopeCompute.fastPath, "still fast path");
		}

	});


	QUnit.ok(scopeCompute.fastPath, "fast path");

	changeNumber++;
	map.attr("value", "b");
});

test("read should support passing %scope (#24)", function() {
	var scope = new Scope(new Map({ foo: "", bar: "" }));

	equal(scope.read("%scope").value, scope, "looked up %scope correctly");
});
