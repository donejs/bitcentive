import QUnit from 'steal-qunit';
import { ViewModel, reducers } from './alerts';
import hub from 'bitcentive/lib/event-hub';

// ViewModel unit tests
QUnit.module('bitcentive/components/alerts');

QUnit.test('Hub alerts are handled correctly', assert => {
	const done = assert.async();
	const vm = new ViewModel();

	// Always unbind
	const handler = (ev, alerts) => {
		assert.equal(alerts.length, 1);
		assert.ok(alerts[0].hasOwnProperty('id'));
		assert.ok(alerts[0].hasOwnProperty('kind'));
		vm.off('alerts', handler);
		done();
	};

	vm.on('alerts', handler);
	hub.dispatch({type: 'alert'});
});

QUnit.test('Can remove items', assert => {
	const done = assert.async();
	const vm = new ViewModel();

	// Always unbind
	const handler = ev => {
		assert.equal(ev.type, 'remove');
		assert.equal(ev.id, 1234);
		vm.off('remove', handler);
		done();
	};

	vm.on('remove', handler);
	vm.removeAlert({ id: 1234 });
});

QUnit.test('Autohide automatically creates a remove action', assert => {
	const done = assert.async();
	const vm = new ViewModel();

	// Always unbind
	const handler = ev => {
		assert.equal(ev.type, 'remove');
		vm.autoHideStream.offValue(handler);
		done();
	};

	vm.autoHideStream.onValue(handler);
	hub.dispatch({ type: 'alert', displayInterval: 100 });
});
