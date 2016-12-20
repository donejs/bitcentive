import QUnit from 'steal-qunit';
import { ViewModel, reducers } from './alerts';
import AlertItem from 'bitcentive/models/alert';
import hub from 'bitcentive/lib/event-hub';

// ViewModel unit tests
QUnit.module('bitcentive/components/alerts');

QUnit.test('Can add items', assert => {
	const done = assert.async();
	const vm = new ViewModel();
	const alert = new AlertItem();

	vm.addAlertStream.onValue(value => {
		assert.ok(value.hasOwnProperty('action'));
		assert.ok(value.hasOwnProperty('alert'));
		assert.equal(value.action, 'ADD_ALERT');
		done();
	});
	vm.addAlert(alert);
});

QUnit.test('Hub alerts are handled correctly', assert => {
	const done = assert.async();
	const vm = new ViewModel();

	vm.addAlertStream.onValue(value => {
		assert.ok(value.hasOwnProperty('action'));
		assert.ok(value.hasOwnProperty('alert'));
		assert.equal(value.action, 'ADD_ALERT');
		done();
	});
	hub.dispatch('alert', [{}]);
});

QUnit.test('Plain objects are converted to AlertItems', assert => {
	const done = assert.async();
	const vm = new ViewModel();

	vm.addAlertStream.onValue(value => {
		assert.ok(value.alert instanceof AlertItem);
		assert.equal(value.alert.message, 'Foo');
		done();
	});
	vm.addAlert({ message: 'Foo' });
});

QUnit.test('Can remove items', assert => {
	const done = assert.async();
	const vm = new ViewModel();
	const alert = new AlertItem();

	vm.removeAlertStream.onValue(value => {
		assert.ok(value.hasOwnProperty('action'));
		assert.ok(value.hasOwnProperty('alert'));
		assert.equal(value.action, 'REMOVE_ALERT');
		done();
	});
	vm.removeAlert(alert);
});

QUnit.test('Autohide automatically creates a remove action', assert => {
	const done = assert.async();
	const vm = new ViewModel();

	vm.autoHideStream.onValue(value => {
		assert.ok(value.hasOwnProperty('action'));
		assert.ok(value.hasOwnProperty('alert'));
		assert.equal(value.action, 'REMOVE_ALERT');
		done();
	});
	vm.addAlert({ displayInterval: 100 });
});

QUnit.test('reducers.add adds to the front of the array', assert => {
	const orig = [{id: 1}, {id: 2}];
	const result = reducers.add(orig, {id: 3});
	assert.equal(orig.length, 2, 'Does not mutate input array');
	assert.equal(result.length, 3);
	assert.equal(result[0].id, 3);
});

QUnit.test('reducers.remove matches on ID', assert => {
	const orig = [{id: 1}, {id: 2}];
	const result = reducers.remove(orig, {id: 1});
	assert.equal(orig.length, 2, 'Does not mutate input array');
	assert.equal(result.length, 1);
	assert.equal(result[0].id, 2);
});

QUnit.test('reducers.remove does not fail if alert doesn\'t exist', assert => {
	try {
		const result = reducers.remove([], {id: 1});
		assert.ok(true);
	} catch (ex) {
		assert.notOk(true, 'Should not error');
	}
});
