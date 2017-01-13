'use strict';

const assert = require('assert');
const requireAdmin = require('../../src/hooks/require-admin');

describe('requireAdmin hook', function() {
	it('only runs in before', () => {
		const hook = requireAdmin();
		assert.throws(() => {
			hook({ type: 'after' });
		});
	});
	it('returns a promise', () => {
		const hook = requireAdmin();
		var ret = hook({
			type: 'before',
			params: {}
		});
		assert.ok(ret instanceof Promise);
	});
	it('throws if there is no user', () => {
		const hook = requireAdmin();
		assert.throws(() => {
			hook({
				type: 'before',
				method: 'create',
				params: {
					provider: 'test'
				}
			});
		});
	});
	it('throws if the user is not an admin', () => {
		const hook = requireAdmin();
		assert.throws(() => {
			hook({ 
				type: 'before',
				method: 'create',
				params: {
					provider: 'test',
					user: { isAdmin: false }
				}
			});
		});
	});
});
