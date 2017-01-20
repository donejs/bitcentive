'use strict';

const errors = require('feathers-errors');

module.exports = function (options) {
	options = Object.assign({
		// Limit this hook to these methods
		methods: ['create', 'update', 'patch', 'remove'],
		// Allow certain paths (hook.path) to pass through
		ignorePaths: []
	}, options || {});

	options.methods = options.methods.reduce((obj, method) => {
		obj[method] = 1;
		return obj;
	}, {});

	options.ignorePaths = options.ignorePaths.reduce((obj, path) => {
		obj[path.replace(/^\//, '')] = 1;
		return obj;
	}, {});

	return function (hook){
		if (hook.type !== 'before') {
			throw new Error('The \'requireAdmin\' hook should only be used as a \'before\' hook.');
		}
		if (hook.params.provider && options.methods[hook.method] && !options.ignorePaths[hook.path]) {
			if (!hook.params.user) {
				throw new Error('You must first restrict to authenticated for using the \'requireAdmin\' hook');
			}
			if (!hook.params.user.isAdmin) {
				throw new errors.Forbidden('Administrative access required to perform that action.');
			}
		}
		return Promise.resolve(hook);
	};
};
