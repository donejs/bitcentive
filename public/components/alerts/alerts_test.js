import QUnit from 'steal-qunit';
import { ViewModel } from './alerts';
import AlertItem from 'bitcentive/models/alert';

// ViewModel unit tests
QUnit.module('bitcentive/components/alerts');

QUnit.test('Can add and remove items', assert => {
	const vm = new ViewModel();
	const alert = new AlertItem();

	vm.addAlert(alert);
	assert.equal(vm.alerts.length, 1);
	vm.removeAlert(alert);
	assert.equal(vm.alerts.length, 0);
});

QUnit.test('removeAlert doesn\'t fail if alert does not exist', assert => {
	const vm = new ViewModel();

	try {
		vm.removeAlert({});
		assert.ok(true);
	} catch (ex) {
		assert.notOk(true, 'should not error');
	}
});

QUnit.test('showAlert sets visibility after short delay', assert => {
	const done = assert.async();
	const vm = new ViewModel();
	const alert = new AlertItem();

	vm.showAlert(alert);
	assert.notOk(alert.visible, 'should not be visible synchronously');

	setTimeout(() => {
		assert.equal(alert.visible, true);
		done();
	}, 100);
});

QUnit.test('showAlert hides alert if displayInterval > 0', assert => {
	const done = assert.async();
	const vm = new ViewModel();
	const alert = new AlertItem();
	alert.displayInterval = 300;

	vm.showAlert(alert);
	setTimeout(() => {
		assert.notOk(alert.visible, 'alert should no longer be visible');
		done();
	}, 400);
});

QUnit.test('hideAlert removes alert from list after delay', assert => {
	const done = assert.async();
	const vm = new ViewModel();
	const alert = new AlertItem();

	vm.alerts = [alert];
	vm.hideAlert(alert);
	assert.equal(vm.alerts.length, 1, 'not removed synchronously');
	setTimeout(() => {
		assert.equal(vm.alerts.length, 0);
		done();
	}, 600);
});