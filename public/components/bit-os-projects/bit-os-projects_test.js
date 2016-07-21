import QUnit from 'steal-qunit';
import { ViewModel } from './bit-os-projects';

// ViewModel unit tests
QUnit.module('bitcentive/components/bit-os-projects');

QUnit.test('Has adding property', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.adding, false);
});
