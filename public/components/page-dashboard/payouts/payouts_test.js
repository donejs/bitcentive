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
      QUnit.equal(vm.contributionMonths.osProjectContributionsMap(month)['1-CanJS'].contributors['1-JustinMeyer'].points, 10, 'has a contributor for CanJS');
      QUnit.equal(vm.contributionMonths.osProjectContributionsMap(month)['1-CanJS'].totalPoints, 40, 'has totalPoints for CanJS as 40');
      done();
    });
  });
});

QUnit.test('viewModel.payoutFor', function(assert){
    const amounts = {
        '1-JustinMeyer': {
            '1-CanJS': {
                total: 87.5,
                percent: 0.25,
            },
            '2-DoneJS': {
                total: 0,
                percent: 0,
            },
            '3-StealJS': {
                total: 0,
                percent: 0,
            },
        },
        '2-KyleGifford': {
            '1-CanJS': {
                total: 262.5,
                percent: 0.75,
            },
            '2-DoneJS': {
                total: 375,
                percent: 1,
            },
            '3-StealJS': {
                total: 0,
                percent: 0,
            },
        },
    };

    let done = assert.async();
    let vm;
    ContributionMonth.get("1").then(month => {
        vm = new ViewModel({ contributionMonth: month });
        vm.on('contributionMonths', () => {
            let monthlyContributors = vm.contributionMonth.monthlyContributors
            let monthlyOSProjects = vm.contributionMonth.monthlyOSProjects

            for (let contributorIndex = 0; contributorIndex < monthlyContributors.length; contributorIndex++) {
                let { contributorRef } = monthlyContributors[contributorIndex];
                for (let projectIndex = 0; projectIndex < monthlyOSProjects.length; projectIndex++) {
                    let { osProjectRef } = monthlyOSProjects[projectIndex];

                    let amount = vm.payoutFor(contributorRef, osProjectRef);
                    delete amount.osProjectRef;
                    assert.deepEqual(amount, amounts[contributorRef._id][osProjectRef._id]);
                }
            }
            done();
        });
    });
});
