import QUnit from 'steal-qunit';
import 'bitcentive/models/fixtures/fixtures-socket';
import { store } from 'bitcentive/models/fixtures/contribution-months.js';
import { ClientProjectVM } from './client-projects';
import ContributionMonth from 'bitcentive/models/contribution-month/';

QUnit.module('bitcentive/components/contributions/', {
  beforeEach: function(){
    // Reset fixture store before every test:
    store.reset();
  }
});

QUnit.asyncTest('viewModel.addContribution', function(){
  ContributionMonth.get("1").then(month => {
    var vm = new ClientProjectVM({
      contributionMonth: month,
      selectedClientId: "2-Walmart"
    });
    QUnit.equal(vm.contributionMonth.monthlyClientProjects.length, 1, 'should have 1 client project');
    vm.contributionMonth.monthlyClientProjects.on('length', function(){
      QUnit.equal(vm.contributionMonth.monthlyClientProjects.length, 2, 'should have 2 client project after addClient');
      QUnit.start();
    });
    vm.addClient(null, vm.contributionMonth.monthlyClientProjects);
  });
});
