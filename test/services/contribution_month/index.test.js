'use strict';

const assert = require('assert');
const app = require('../../../src/app');
const helpers = require('../helpers');
const validateDataHook = require('../../../src/services/contribution_month/hooks/validate-request-data');

describe('contribution_month service', function() {
  it('registered the contribution_months service', () => {
    assert.ok(app.service('/api/contribution_months'));
  });
});

describe('contribution_month validate data hook', function() {
	const hookFn = validateDataHook();

	it('does not allow duplicate months to be created', function(done) {
		// The hook will attempt to load an existing month.
		// If one exists, then the hook should fail.
		const context = {
			Model: helpers.createMockQueryObj([{
				date: new Date()
			}])
		};

		const promise = hookFn.call(context, {
			method: 'create',
			data: {
				date: new Date()
			}
		});
		promise.then(() => {
			done(new Error('The hook allowed a duplicate'));
		});
		promise.catch(err => {
			assert.ok(true, 'The hook prevented a duplicate');
			done();
		});
	});

	it('allows a new month to be created', function(done) {
		// The hook will attempt to load an existing month.
		// If none exist, the hook should succeed.
		const context = {
			Model: helpers.createMockQueryObj([/* return nothing */])
		};

		const promise = hookFn.call(context, {
			method: 'create',
			data: {
				date: new Date()
			}
		});
		promise.then(hook => {
			assert.ok(true, 'The hook passed');
			done();
		});
		promise.catch(err => {
			done(new Error('The hook failed: ' + err));
		});
	});
});
