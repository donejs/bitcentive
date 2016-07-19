'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('contributor service', function() {
  it('registered the contributors service', () => {
    assert.ok(app.service('contributors'));
  });
});
