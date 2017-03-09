var QUnit = require('steal-qunit');
var viewModel = require('can-view-model');
var SimpleMap = require('can-simple-map');
var types = require('can-types');

QUnit.module('can-view-model');

QUnit.test('basics', function(){
	var DefaultMap = types.DefaultMap;
	types.DefaultMap = undefined;
	var el = document.createElement('div');
	viewModel(el, 'foo', 'bar');
	QUnit.equal(viewModel(el,'foo'), 'bar');
	QUnit.ok(viewModel(el) instanceof SimpleMap, 'is can-map');
	types.DefaultMap = DefaultMap;
});

QUnit.test('a selector can be passed as the first argument (#6)', function(){
	var DefaultMap = types.DefaultMap;
	types.DefaultMap = undefined;
	var el = document.createElement('div');
	el.className = 'the-el';
	document.getElementById('qunit-fixture').appendChild(el);
	viewModel('.the-el', 'foo', 'bar');
	QUnit.equal(viewModel('.the-el', 'foo'), 'bar');
	QUnit.ok(viewModel(el) instanceof SimpleMap, 'is can-map');
	types.DefaultMap = DefaultMap;
});
