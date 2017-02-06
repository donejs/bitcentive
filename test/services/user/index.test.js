'use strict';

const assert = require('assert');
const app = require('../../../src/app');
const makeFirstAdmin = require('../../../src/services/user/hooks/make-first-admin');

const makeHookObj = (method, data) => {
	return {
		method,
		app,
		data
	};
};

describe('user service', function() {
	it('registered the users service', () => {
		assert.ok(app.service('/api/users'));
	});

	it('Sets new user to an admin if one does not yet exist.', function () {
		const User = app.service('/api/users').Model;
		const oldFindOne = User.findOne;
		const hookObj = makeHookObj('create', { isAdmin: false });
		const hook = makeFirstAdmin();

		User.findOne = function (params, cb) {
			cb(null, null);	
		};

		// mocha lets us return a promise
		return hook(hookObj).then(result => {
			assert.ok(result.data.isAdmin, 'User should be an admin');
		});
	});

	it('Does not set user to admin if one already exists', function () {
		const User = app.service('/api/users').Model;
		const oldFindOne = User.findOne;
		const hookObj = makeHookObj('create', { isAdmin: false });
		const hook = makeFirstAdmin();

		User.findOne = function (params, cb) {
			// Mimicks finding a user in db where isAdmin: true
			cb(null, { isAdmin: true });	
		};

		// mocha lets us return a promise
		return hook(hookObj).then(result => {
			assert.ok(result.data.isAdmin === false, 'User should NOT be admin');
		});
	});
});
