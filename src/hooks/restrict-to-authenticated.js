'use strict';

const errors = require('feathers-errors');

module.exports = function () {
	return function (hook) {
		if (hook.type !== 'before') {
			throw new Error('The \'restrictToAuthenticated\' hook should only be used as a \'before\' hook.');
		}
		if (hook.params.provider && hook.params.user === undefined) {
			throw new errors.NotAuthenticated('You are not authenticated.');
		}
	};
};
