import QUnit from 'steal-qunit';

// Mock socket.io server:
import 'bitcentive/models/fixtures/fixtures-socket';
import { store } from 'bitcentive/models/fixtures/contribution-months.js';


// Load VM:
import { ViewModel } from 'bitcentive/components/contribution-month/';

QUnit.module('bitcentive/components/contribution-month/', {
  before: function(){
    // Reset fixture store before every test:
    store.reset();
  }
});

QUnit.asyncTest('Load projects from socket fixture', function () {
  let vm = new ViewModel({
    contributionMonthId: "1"
  });

  vm.contributionMonthPromise.then((contributionMonth) => {
    QUnit.equal(contributionMonth.monthlyOSProjects.length, 3, 'Loaded 3 OS projects');
    QUnit.equal(contributionMonth.monthlyClientProjects.length, 1, 'Loaded 1 client project');
    QUnit.start();
  });
});

QUnit.asyncTest('Check if the correct contribution month totals are being calculated properly', function(){
  let vm = new ViewModel({
    contributionMonthId: '1'
  });

  vm.contributionMonthPromise.then((contributionMonth) => {
    var clientProject = contributionMonth.calculations.clientProjects['1-Levis'];
    QUnit.equal(clientProject.totalSignificance, 10, 'calculated correct total significance for first client project');
    QUnit.equal(clientProject.rate, "3.50", 'calculated correct rate for first client project');
    QUnit.equal(clientProject.totalAmount, "350.00", 'calculated correct total amount for first client project');

    QUnit.equal(contributionMonth.calculations.totalDollarForAllClientProjects, 350, 'calculated correct total dollar amount for all client projects');
    QUnit.start();
  });

});
