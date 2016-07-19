'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('client_project service', function() {
  it('registered the client_projects service', () => {
    assert.ok(app.service('client_projects'));
  });
});
