'use strict';

const assert = require('assert');
const restrictToAuthenticated = require('../../src/hooks/require-admin');

describe('restrictToAuthenticated hook', function() {
	it('only runs in before', () => {
		const hook = restrictToAuthenticated();
		assert.throws(() => {
			hook({ type: 'after' });
		});
	});
	it('returns a promise', () => {
		const hook = restrictToAuthenticated();
		var ret = hook({
			type: 'before',
			params: {}
		});
		assert.ok(ret instanceof Promise);
	});
	it('throws if there is no user', () => {
		const hook = restrictToAuthenticated();
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
});
