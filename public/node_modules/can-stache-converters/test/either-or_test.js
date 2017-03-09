require("can-stache-converters");
var canEvent = require("can-event");
var DefineMap = require("can-define/map/map");
var stache = require("can-stache");
var QUnit = require("steal-qunit");

QUnit.module("either-or");

QUnit.test("can bind to a checkbox", function(){
	var template = stache("<input type='checkbox' {($checked)}='either-or(~pref, \"Star Trek\", \"Star Wars\")' />");
	var map = new DefineMap({
		pref: "Star Trek"
	});

	var input = template(map).firstChild;

	QUnit.equal(input.checked, true, "initial value is right");

	input.checked = false;
	canEvent.trigger.call(input, "change");

	QUnit.equal(map.pref, "Star Wars", "changed because input changed");

	map.pref = "Star Trek";
	QUnit.equal(input.checked, true, "changed because map changed");
});

