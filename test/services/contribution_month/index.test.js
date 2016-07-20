'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('contribution_month service', function() {
  it('registered the contribution_months service', () => {
    assert.ok(app.service('/api/contribution_months'));
  });
});
