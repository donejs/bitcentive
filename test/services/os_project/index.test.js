'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('os_project service', function() {
  it('registered the os_projects service', () => {
    assert.ok(app.service('os_projects'));
  });
});
