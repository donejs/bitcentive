'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('client-project service', function() {
  it('registered the client-projects service', () => {
    assert.ok(app.service('client-projects'));
  });
});
