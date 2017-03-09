

test("compute.read works with a Map wrapped in a compute", function() {
	var parent = can.compute(new can.Map({map: {first: "Justin" }}));

	var result = can.compute.read(parent, can.compute.read.reads("map.first"));
	equal(result.value, "Justin", "The correct value is found.");
});

test('compute.read works with a Map wrapped in a compute', function() {
	var parent = new can.Compute(new can.Map({map: {first: 'Justin' }}));

	var result = can.Compute.read(parent, can.compute.read.reads("map.first"));
	equal(result.value, 'Justin', 'The correct value is found.');
});



test("compute.read returns constructor functions instead of executing them (#1332)", function() {
	var Todo = can.Map.extend({});
	var parent = can.compute(new can.Map({map: { Test: Todo }}));

	var result = can.compute.read(parent, can.compute.read.reads("map.Test"));
	equal(result.value, Todo, 'Got the same Todo');
});



test("prototype computes work (#2098)", function(){
	var Map = can.Map.extend({
		plusOne: can.compute(function(){
			return this.attr("value")+1;
		})
	});
	var root = new Map({value: 2}),
		read;
	read = can.compute.read(root, can.compute.read.reads("plusOne") );
	equal(read.value, 3, "static properties on a can.Construct-based function");
});

test("expandos on can.Map can be read (#2199)", function(){
	var map = new can.Map({});
	var expandoMethod = function(){
		return this.expandoProp+"!";
	};
	map.expandoMethod = expandoMethod;
	map.expandoProp = "val";

	var read = can.compute.read(map, can.compute.read.reads("@expandoMethod") );
	equal(read.value(),"val!", "got expando method");

	read = can.compute.read(map, can.compute.read.reads("expandoProp") );
	equal(read.value,"val", "got expando prop");
});
test("compute.set with different values", 4, function() {
	var comp = can.compute("David");
	var parent = {
		name: "David",
		comp: comp
	};
	var map = new can.Map({
		name: "David"
	});

	map.bind('change', function(ev, attr, how, value) {
		equal(value, "Brian", "Got change event on map");
	});

	can.compute.set(parent, "name", "Matthew");
	equal(parent.name, "Matthew", "Name set");

	can.compute.set(parent, "comp", "Justin");
	equal(comp(), "Justin", "Name updated");

	can.compute.set(map, "name", "Brian");
	equal(map.attr("name"), "Brian", "Name updated in map");
});
