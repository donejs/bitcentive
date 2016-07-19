import QUnit from 'steal-qunit';
import { ViewModel } from './os-projects';

// ViewModel unit tests
QUnit.module('bitcentive/components/os-projects');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the bit-os-projects component');
});
