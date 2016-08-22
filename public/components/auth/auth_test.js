import QUnit from 'steal-qunit';
import { ViewModel } from './auth';

// ViewModel unit tests
QUnit.module('bitcentive/components/auth');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the auth component');
});
