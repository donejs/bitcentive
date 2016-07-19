import QUnit from 'steal-qunit';
import { ViewModel } from './client-projects';

// ViewModel unit tests
QUnit.module('bitcentive/components/client-projects');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the bit-client-projects component');
});
