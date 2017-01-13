import QUnit from 'steal-qunit';
import { ViewModel } from './page-users';
import User from 'bitcentive/models/user';
import 'bitcentive/models/fixtures/fixtures-socket';

// ViewModel unit tests
QUnit.module('bitcentive/components/page-users');

QUnit.test('loads users', assert => {
	let done = assert.async();
	let vm = new ViewModel();

	vm.usersPromise.then(users => {
		assert.ok(users.length, 'users loaded');

		done();
	});
});
