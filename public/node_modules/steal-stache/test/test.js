var template = require('./template.stache!');
var nodeLists = require("can-view-nodelist");
var stache = require("can-stache");
var QUnit = require("steal-qunit");
var loader = require("@loader");

QUnit.module("steal-stache");

QUnit.test("node-lists work", function(){
	var nl = nodeLists.register([], undefined, true);
	stache.registerHelper('importTestHelper', function(options) {
		QUnit.equal(options.nodeList, nl.replacements[0], 'correct node list reference');
	});

	template({}, {}, nl);
});

QUnit.test("can-import works", function(){
	stop();
	loader["import"]("test/tests/foo.stache")
	.then(function(template){
		var frag = template();

		setTimeout(function(){
			var span = frag.firstChild.nextSibling.nextSibling;
			equal(span.firstChild.nodeValue, "works", "imported bar and used it");

			start();
		},5);
	});
});
