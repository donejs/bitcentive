import QUnit from 'steal-qunit';
import { ViewModel } from './page-dashboard';

// ViewModel unit tests
QUnit.module('bitcentive/components/page-dashboard');

QUnit.test('viewModel attributes', function(){
  var vm = new ViewModel({
    contributionMonthId: 1
  });
  QUnit.equal(vm.contributionMonthId, 1, 'viewModel has a contributionMonthId');
});
