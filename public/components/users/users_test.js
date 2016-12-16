import QUnit from 'steal-qunit';
import 'bitcentive/models/fixtures/fixtures-socket';
import { store } from 'bitcentive/models/fixtures/contribution-months.js';
import { UsersVM } from './users';
import User from 'bitcentive/models/user';

QUnit.module('bitcentive/components/users/', {
  beforeEach: function(){
    // Reset fixture store before every test:
    store.reset();
  }
});

QUnit.asyncTest('viewModel.addUser', function(){
  User.getList({}).then(items => {
    var vm = new UsersVM({
      users: items,
      newUserName: 'Ilya',
      newUserEmail: 'ilya@bitovi.com'
    });
    QUnit.equal(vm.users.length, 2, 'should have 2 users');
    vm.users.on('length', function(){
      QUnit.equal(vm.users.length, 3, 'should have 3 users after addUser');
      QUnit.start();
    });
    vm.addUser();
  });
});
