import QUnit from 'steal-qunit';
import { ViewModel } from './page-contributors';

// ViewModel unit tests
QUnit.module('bitcentive/components/page-contributors');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.message, 'This is the page-contributors component');
});
