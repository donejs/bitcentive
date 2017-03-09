require("can-stache-converters");
var canEvent = require("can-event");
var compute = require("can-compute");
var DefineList = require("can-define/list/list");
var DefineMap = require("can-define/map/map");
var stache = require("can-stache");
var each = require("can-util/js/each/each");

var QUnit = require("steal-qunit");

QUnit.module("equal");

QUnit.test("Basics works", function(){
	var template = stache('<input type="radio" {($checked)}="equal(~attending, \'yes\'" /><input type="radio" {($checked)}="equal(~attending, \'no\'" />');
	var attending = compute("yes");

	var yes = template({ attending: attending }).firstChild,
		no = yes.nextSibling;

	QUnit.equal(yes.checked, true, "initially a yes");
	QUnit.equal(no.checked, false, "initially unchecked");

	attending("no");

	QUnit.equal(yes.checked, false, "now not checked");
	QUnit.equal(no.checked, true, "now checked");

	// User changing stuff
	yes.checked = true;
	canEvent.trigger.call(yes, "change");

	QUnit.equal(attending(), "yes", "now it is yes");
	QUnit.equal(yes.checked, true, "yes is checked");
	QUnit.equal(no.checked, false, "no is unchecked");
});

QUnit.test("Allows one-way binding when passed a non-compute as the first argument", function(){
	var template = stache('<input type="radio" {($checked)}="equal(attending, true)" />');
	var attending = compute(false);

	var input = template({ attending: attending }).firstChild;

	QUnit.equal(input.checked, false, 'initially false');

	attending(true);

	QUnit.equal(input.checked, true, 'can be changed to true');

	input.checked = false;

	QUnit.equal(attending(), true, 'does not change compute');
});
