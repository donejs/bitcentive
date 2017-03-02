import QUnit from 'steal-qunit';
import { ViewModel } from './users';
import User from 'bitcentive/models/user';
import 'bitcentive/models/fixtures/fixtures-socket';

// ViewModel unit tests
QUnit.module('bitcentive/components/page-users/users');

QUnit.test('setAdmin', assert => {
	let done = assert.async();

	User.getList({ }).then(users => {
		let user = users[0];
		let isAdmin = user.isAdmin;
		let vm = new ViewModel();

		vm.setAdmin(user, !isAdmin).then(updatedUser => {
			assert.strictEqual(updatedUser.isAdmin, !isAdmin, 'user updated');

			done();
		});
	});
});
