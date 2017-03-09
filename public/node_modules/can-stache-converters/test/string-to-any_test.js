require("can-stache-converters");
var canEvent = require("can-event");
var DefineList = require("can-define/list/list");
var DefineMap = require("can-define/map/map");
var stache = require("can-stache");
var each = require("can-util/js/each/each");

var QUnit = require("steal-qunit");

QUnit.module("string-to-any");

QUnit.test("Works on all the types", function(){
	var types = {
		"22.3": 22.3,
		"foo": "foo",
		"true": true,
		"false": false,
		"undefined": undefined,
		"null": null,
		"Infinity": Infinity,
		"NaN": {
			expected: NaN,
			equalityTest: function(a){
				return isNaN(a);
			}
		}
	};

	var defaultEquality = function(a, b) {
		return a === b;
	};

	each(types, function(expected, type){
		var template = stache('<select {($value)}="string-to-any(~val)"><option value="test">test</option><option value="' + type + '">' + type + '</option></select>');
		var map = new DefineMap({
			val: "test"
		});

		var frag = template(map);
		var select = frag.firstChild;
		var option = select.firstChild.nextSibling;

		var equality = defaultEquality;
		if(expected != null && expected.equalityTest) {
			equality = expected.equalityTest;
			expected = expected.expected;
		}

		// Select this type's option
		select.value = type;
		canEvent.trigger.call(select, "change");

		QUnit.ok(equality(map.val, expected), "map's value updated to: " + type);

		// Now go the other way.
		map.val = "test";
		map.val = expected;

		QUnit.equal(select.value, type, "select's value updated to: " + type);
	});


});
