import QUnit from 'steal-qunit';
import { ViewModel } from './page-dashboard';

// ViewModel unit tests
QUnit.module('bitcentive/components/page-dashboard');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the page-dashboard component');
});
