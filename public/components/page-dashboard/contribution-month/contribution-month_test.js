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

QUnit.test('Load projects from socket fixture', function (assert) {
  let done = assert.async();
  let vm = new ViewModel({
    contributionMonthId: "1"
  });

  vm.contributionMonthPromise.then((contributionMonth) => {
    QUnit.equal(contributionMonth.monthlyOSProjects.length, 3, 'Loaded 3 OS projects');
    QUnit.equal(contributionMonth.monthlyClientProjects.length, 1, 'Loaded 1 client project');
    done();
  });
});
