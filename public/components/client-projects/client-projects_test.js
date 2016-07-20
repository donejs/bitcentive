import QUnit from 'steal-qunit';
import { ClientProjectVM } from './client-projects';

// ViewModel unit tests
QUnit.module('bitcentive/components/client-projects');

QUnit.test('Has message', function(){
  var vm = new ClientProjectVM();
  // QUnit.equal(vm.message, 'This is the bit-client-projects component');
});
