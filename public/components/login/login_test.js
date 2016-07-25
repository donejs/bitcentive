import QUnit from 'steal-qunit';
import { ViewModel } from './login';

// ViewModel unit tests
QUnit.module('bitcentive/components/login');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the bit-login component');
});
