import QUnit from 'steal-qunit';
import 'bitcentive/models/fixtures/fixtures-socket';
import { store } from 'bitcentive/models/fixtures/contribution-months.js';
import { ClientProjectVM } from './client-projects';
import ContributionMonth from 'bitcentive/models/contribution-month/';

QUnit.module('bitcentive/components/page-dashboard/client-projects/', {
  beforeEach: function(){
    // Reset fixture store before every test:
    store.reset();
  }
});

QUnit.test('viewModel.addClient', function(assert){
  let done = assert.async();
  ContributionMonth.get("1").then(month => {
    let vm = new ClientProjectVM({
      contributionMonth: month,
      selectedClientId: "2-Walmart"
    });
    QUnit.equal(vm.contributionMonth.monthlyClientProjects.length, 2, 'should have 2 client project');
    vm.contributionMonth.monthlyClientProjects.on('length', function(){
      QUnit.equal(vm.contributionMonth.monthlyClientProjects.length, 3, 'should have 3 client project after addClient');
      done();
    });
    vm.addClient(null, vm.contributionMonth.monthlyClientProjects);
  });
});
