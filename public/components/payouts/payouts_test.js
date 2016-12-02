import QUnit from 'steal-qunit';
import { ViewModel } from './report';

// ViewModel unit tests
QUnit.module('bitcentive/components/report');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the bit-report component');
});
