import QUnit from 'steal-qunit';
import 'bitcentive/models/fixtures/fixtures-socket';
import { store } from 'bitcentive/models/fixtures/contribution-months.js';
import { ViewModel } from './contributions';
import ContributionMonth from 'bitcentive/models/contribution-month/';

QUnit.module('bitcentive/components/contributions/', {
  beforeEach: function(){
    // Reset fixture store before every test:
    store.reset();
  }
});

QUnit.asyncTest('viewModel.addContribution', function(){
  ContributionMonth.get("1").then(month => {
    var vm = new ViewModel({
      contributionMonth: month,
      description: "some new contribution",
      points: 5,
      selectedOSProjectId: "1-CanJS",
      selectedContributorId: "1-JustinMeyer"
    });
    QUnit.equal(vm.contributionMonth.monthlyContributions.length, 2, 'should have 2 contributions');
    vm.contributionMonth.monthlyContributions.on('length', function(){
      QUnit.equal(vm.contributionMonth.monthlyContributions.length, 3, 'should have 3 contributions after addContribution');
      QUnit.start();
    });
    vm.addContribution();
  });
});
