import QUnit from 'steal-qunit';
import 'bitcentive/models/fixtures/fixtures-socket';
import { store } from 'bitcentive/models/fixtures/contribution-months.js';
import ContributionMonth from 'bitcentive/models/contribution-month/';
import { ViewModel } from './payouts';

// ViewModel unit tests
QUnit.module('bitcentive/components/payouts', {
  beforeEach: function(){
    // Reset fixture store before every test:
    store.reset();
  }
});

QUnit.asyncTest('viewModel.OSProjectContributionsMap', function(){
  var vm;
  ContributionMonth.get("1").then(month => {
    vm = new ViewModel({ contributionMonth: month });
    vm.on('contributionMonths', () => {
      QUnit.equal(vm.contributionMonths.OSProjectContributionsMap['1-CanJS'].contributors['1-JustinMeyer'].points, 10, 'has a contributor for CanJS');
      QUnit.equal(vm.contributionMonths.OSProjectContributionsMap['1-CanJS'].totalPoints, 10, 'has totalPoints for CanJS as 10');
      QUnit.start();
    });
  });
});

QUnit.asyncTest('viewModel.getOSProjectPayoutTotal', function(){
  var vm;
  ContributionMonth.get("1").then(month => {
    vm = new ViewModel({ contributionMonth: month });
    vm.on('contributionMonths', () => {
      QUnit.equal(vm.getOSProjectPayoutTotal(
        vm.contributionMonth.monthlyOSProjects[0],
        vm.contributionMonth.monthlyContributions.contributorsMap['1-JustinMeyer']
      ), 350, 'Total for the 1st contributor should be 350');
      QUnit.start();
    });
  });
});
