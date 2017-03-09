var QUnit = require('steal-qunit');
var cid = require('can-cid');
var namespace = require('can-namespace');
var clone = require('steal-clone');

QUnit.module("can-cid");

QUnit.test("assigns incremental ids", function(){
	var i;
	var objects = [{}, {}, {}, {}, {}];
	var ref = parseInt(cid({}), 10) + 1;

	for(i = 0; i < objects.length; i++){
		equal(i+ref, cid(objects[i]), "cid function returns the id");
	}

	for(i = 0; i < objects.length; i++){
		equal(i+ref, objects[i]._cid, "cid function assigns the ids");
	}
});

QUnit.test("assigns id based on name", function(){
	var reference = {};
	var named = {};
	var id_num = parseInt(cid(reference), 10) + 1;

	cid(named, "name");
	equal(named._cid, "name" + id_num);
});

QUnit.test("sets can-namespace.cid", function() {
	equal(namespace.cid, cid);
});

QUnit.test('should throw if can-namespace.cid is already defined', function() {
	stop();
	clone({
		'can-namespace': {
			default: {
				cid: {}
			},
			__useDefault: true
		}
	})
	.import('./can-cid')
	.then(function() {
		ok(false, 'should throw');
		start();
	})
	.catch(function(err) {
		ok(err && err.message.indexOf('can-cid') >= 0, 'should throw an error about can-cid');
		start();
	});
});
