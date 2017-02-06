'use strict';

const errors = require('feathers-errors');
const denodeify = require('denodeify');

/**
 * This hook will check to see if any admins exist in the database.
 * If not, the current user will be considered an admin.
 */

// If we have an admin, there's no sense checking in the future.
let ADMIN_EXISTS = false;

module.exports = () => {
	return function (hook) {
		if (!ADMIN_EXISTS) {
			let user = hook.data;

			if (!user.isAdmin) {

				const User = hook.app.service('/api/users').Model;
				const findUser = denodeify(User.findOne.bind(User));

				return findUser({
					isAdmin: true
				}).then(result => {
					if (!result) {
						user.isAdmin = true;
					}
					ADMIN_EXISTS = true;
					return hook;
				});
			}
			ADMIN_EXISTS = true;
		}
		return Promise.resolve(hook);
	};
};
