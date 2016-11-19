import QUnit from 'steal-qunit';
import { ViewModel } from './page-home';

// ViewModel unit tests
QUnit.module('bitcentive/components/page-home');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the page-home component');
});
