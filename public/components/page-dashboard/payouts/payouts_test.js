import QUnit from 'steal-qunit';
import 'bitcentive/models/fixtures/fixtures-socket';
import { store } from 'bitcentive/models/fixtures/contribution-months.js';
import ContributionMonth from 'bitcentive/models/contribution-month/';
import { ViewModel } from './payouts';

// ViewModel unit tests
QUnit.module('bitcentive/components/page-dashboard/payouts', {
  beforeEach: function(){
    // Reset fixture store before every test:
    store.reset();
  }
});

QUnit.test('viewModel.OSProjectContributionsMap', function(assert){
  let done = assert.async();
  let vm;
  ContributionMonth.get("1").then(month => {
    vm = new ViewModel({ contributionMonth: month });
    vm.on('contributionMonths', () => {
      QUnit.equal(vm.contributionMonths.OSProjectContributionsMap(month)['1-CanJS'].contributors['1-JustinMeyer'].points, 10, 'has a contributor for CanJS');
      QUnit.equal(vm.contributionMonths.OSProjectContributionsMap(month)['1-CanJS'].totalPoints, 10, 'has totalPoints for CanJS as 10');
      done();
    });
  });
});
