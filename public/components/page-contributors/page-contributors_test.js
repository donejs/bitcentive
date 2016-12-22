import QUnit from 'steal-qunit';
import { ViewModel } from './page-contributors';
import { store } from 'bitcentive/models/fixtures/contribution-months.js';

// ViewModel unit tests
QUnit.module('bitcentive/components/page-contributors');

QUnit.test('Loads contributors', function(assert){
	var done = assert.async();
	var vm = new ViewModel();
	vm.contributors.then(contributors => {
		assert.ok(contributors.length, 'Got contributors');
		done();
	});
});
