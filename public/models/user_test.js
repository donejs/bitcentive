import QUnit from 'steal-qunit';
import User from './user';
import 'bitcentive/models/fixtures/fixtures-socket';

QUnit.module('models/user');

QUnit.test('getList', assert => {
  let done = assert.async();

  User.getList({}).then(users => {
    assert.ok(users.length, 'user(s) returned');

    done();
  }, err => {
    assert.ok(false);

    done();
  });
});

QUnit.test('derived properties', assert => {
  let done = assert.async();

  User.getList({}).then(users => {
    let user = users[1];

    assert.equal(user.authProvider, 'github', 'authProvider');
    assert.ok(user.profile, 'profile');
    assert.ok(/http/i.test(user.profileUrl), 'profileUrl');
    assert.ok(/http/i.test(user.photoUrl), 'photoUrl');
    assert.ok(/@/.test(user.email), 'email');
    assert.ok(user.name, 'name');

    let user2 = users[0];
    assert.ok(typeof user2.email === 'undefined', 'no email resolves in undefined');
    assert.ok(typeof user2.photoUrl === 'undefined', 'no photoUrl resolves in undefined');

    done();
  }, err => {
    assert.ok(false);

    done();
  });
});
