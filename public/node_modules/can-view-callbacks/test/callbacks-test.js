var QUnit = require('steal-qunit');
var callbacks = require('can-view-callbacks');
var dev = require('can-util/js/dev/dev');
var can = require('can-namespace');
var clone = require('steal-clone')

QUnit.module('can-view-callbacks');

QUnit.test('Initialized the plugin', function(){
  var handler = function(){

  };
  callbacks.attr(/something-\w+/, handler);
  equal(callbacks.attr("something-else"), handler);
});

QUnit.test("Placed as view.callbacks on the can namespace", function(){
	equal(callbacks, can.view.callbacks, "Namespace value as can.view.callbacks");
});

if (System.env.indexOf('production') < 0) {
	QUnit.test("Show warning if in tag name a hyphen is missed", function () {
		var tagName = "foobar";
		var oldlog = dev.warn;
		dev.warn = function(text) {
			ok(text, "got warning");
			equal(text, "Custom tag: " + tagName.toLowerCase() + " hyphen missed");
			dev.warn = oldlog;
		};

		// make sure tag doesn't already exist
		callbacks.tag(tagName, null);

		// add tag
		callbacks.tag(tagName, function(){});
	});
}

QUnit.test("remove a tag by passing null as second argument", function() {
	var callCount = 0;
	var tagName = "my-tag";
	var handler = function() {
		console.log('this is the handler');
	};
	callbacks.tag(tagName, handler);

	equal(callbacks.tag(tagName), handler, 'passing no second argument should get handler');
	notEqual(callbacks.tag(tagName, null), handler, 'passing null as second argument should remove handler');
});

QUnit.test('should throw if can-namespace.view.callbacks is already defined', function() {
	stop();
	clone({
		'can-namespace': {
			default: {
				view: {
					callbacks: {}
				}
			},
			__useDefault: true
		}
	})
	.import('can-view-callbacks')
	.then(function() {
		ok(false, 'should throw');
		start();
	})
	.catch(function(err) {
		ok(err && err.message.indexOf('can-view-callbacks') >= 0, 'should throw an error about can-view-callbacks');
		start();
	});
});
