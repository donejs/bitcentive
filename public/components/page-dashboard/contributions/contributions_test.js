import QUnit from 'steal-qunit';
import 'bitcentive/models/fixtures/fixtures-socket';
import { store } from 'bitcentive/models/fixtures/contribution-months.js';
import { ViewModel } from './contributions';
import ContributionMonth from 'bitcentive/models/contribution-month/';

QUnit.module('bitcentive/components/page-dashboard/contributions/', {
  beforeEach: function(){
    // Reset fixture store before every test:
    store.reset();
  }
});

QUnit.test('viewModel.addContribution', function(assert){
  let done = assert.async();
  ContributionMonth.get("1").then(month => {
    var vm = new ViewModel({
      contributionMonth: month,
      description: "some new contribution",
      points: 5,
      selectedOSProjectId: "1-CanJS",
      selectedContributorId: "1-JustinMeyer"
    });
    QUnit.equal(vm.contributionMonth.monthlyContributions.length, 4, 'should have 4 contributions');
    vm.contributionMonth.monthlyContributions.on('length', function(){
      QUnit.equal(vm.contributionMonth.monthlyContributions.length, 5, 'should have 5 contributions after addContribution');
      vm.contributionMonth.monthlyContributions.off('length');
      done();
    });
    vm.addContribution();
  });
});
