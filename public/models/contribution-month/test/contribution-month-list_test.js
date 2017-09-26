import QUnit from 'steal-qunit';
import ContributionMonth from '../contribution-month';
import moment from 'moment';

import OSProject from '../../os-project';
import ClientProject from '../../client-project';
import MonthlyClientProjectOsProjectList from '../monthly-client-project-os-project-list';
import Contributor from '../../contributor';
import MonthlyContribution from '../monthly-contribution';
import MonthlyOSProject from '../monthly-os-project';
import MonthlyClientProject from '../monthly-client-project';
import fixture from 'can-fixture';
import { store } from 'bitcentive/models/fixtures/contribution-months.js';

QUnit.module( 'models ContributionMonth.List', {
	setup: function(){
		localStorage.clear();
		// Reset fixture store before every test:
		store.reset();
	}
});

QUnit.test("ContributionMonth.getList() works", function(assert) {
	let done = assert.async();
	ContributionMonth.getList({}).then(function(contributionMonths) {

		// TODO: check if we need to test against `clientProjectRef.value`.
		QUnit.ok(contributionMonths[0].monthlyClientProjects[0].clientProjectRef._id === "1-Levis", 'contains a client project');
		var first = contributionMonths[0].monthlyOSProjects[0].osProjectRef._id,
			second = contributionMonths[0].monthlyClientProjects[0].monthlyClientProjectsOSProjects[0]._id;

		QUnit.ok(first, 'first exists');
		QUnit.ok(first === second, 'first and second are equal');

		done();
	}, function(err) {
		QUnit.ok(false, err);
	});
});

QUnit.test('.getTotalForAllPayoutsForContributor', assert => {
	const amounts = [ 0, 87.5, 65.625, 87.5, 68.75 ];

	let done = assert.async();
	ContributionMonth.getList({}).then(contributionMonths => {
		contributionMonths.forEach((contributionMonth, index) => {
			let contributorRef = contributionMonth.monthlyContributors[0].contributorRef;
			let totalContributorPayout = contributionMonths.getTotalForAllPayoutsForContributor(contributorRef, contributionMonth);

			QUnit.equal(totalContributorPayout, amounts[index], 'Total contributor payout is ' + amounts[index]);
		})

		done();
	}, function(err) {
		QUnit.ok(false, err);
	});
});

QUnit.test('.getOSProjectPayoutTotal', function(assert) {
	const amounts = [ 0, 87.5, 65.625, 87.5, 68.75 ];

	let done = assert.async();
	ContributionMonth.getList({}).then(function(contributionMonths) {
		contributionMonths.forEach((contributionMonth, index) => {
			let monthlyOSProject = contributionMonth.monthlyOSProjects[0];
			let contributor = contributionMonth.monthlyContributors[0];

			let totalPayout = contributionMonths.getOSProjectPayoutTotal(monthlyOSProject, contributor, contributionMonth);

			QUnit.equal(totalPayout, amounts[index], 'Total payout is ' + amounts[index]);
		});

		done();
	}, function(err) {
		QUnit.ok(false, err);
	});
});

QUnit.test('.getOwnershipPercentageForContributor', function(assert) {
	const amounts = [
		[ 0, 0 ],
		[ 0.25, 0.75, 0 ],
		[ 0.1875, 0.5625, 0.25 ],
		[ 0.25, 0.75 ],
		[ 0.19642857142857142, 0.5892857142857143, 0.21428571428571427 ]
	];

	const done = assert.async();
	ContributionMonth.getList({}).then(function(contributionMonths) {
		contributionMonths.forEach((contributionMonth, monthIndex) => {
			const monthlyOSProject = contributionMonth.monthlyOSProjects[0];

			contributionMonth.monthlyContributors.forEach((contributor, contributorIndex) => {
				const percent = contributionMonths.getOwnershipPercentageForContributor(monthlyOSProject, contributor, contributionMonth);
				QUnit.equal(percent, amounts[monthIndex][contributorIndex], 'Percent owned is ' + amounts[monthIndex][contributorIndex]);
			});
		});

		done();
	}, function(err) {
		QUnit.ok(false, err);
	});
});
