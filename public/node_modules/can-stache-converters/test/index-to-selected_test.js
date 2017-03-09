require("can-stache-converters");
var canEvent = require("can-event");
var DefineList = require("can-define/list/list");
var DefineMap = require("can-define/map/map");
var stache = require("can-stache");
var each = require("can-util/js/each/each");

var QUnit = require("steal-qunit");

QUnit.module("index-to-selected");

QUnit.test("chooses select option by the index from a list", function(){
	var template = stache('<select {($value)}="index-to-selected(~person, people)"><option value="none"></option>{{#each people}}<option value="{{%index}}">{{name}}</option>{{/each}}</select>');

	var map = new DefineMap({
		person: "Anne",
		people: [
			"Matthew",
			"Anne",
			"Wilbur"
		]
	});

	var select = template(map).firstChild;

	// Initial value
	QUnit.equal(select.value, 1, "initially set to the first value");

	// Select a different thing.
	select.value = 2;
	canEvent.trigger.call(select, "change");

	QUnit.equal(map.person, "Wilbur", "now it is me");

	// Change the selected the other way.
	map.person = map.people.item(0);

	QUnit.equal(select.value, 0, "set back");

	// Can be set to other stuff too
	select.value = "none";
	canEvent.trigger.call(select, "change");

	QUnit.equal(map.person, undefined, "now undefined because not in the list");
});
