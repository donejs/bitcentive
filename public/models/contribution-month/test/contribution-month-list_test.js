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

QUnit.test("getPointTotalForOSProject", function(){

	const list = new ContributionMonth.List([
		{
			monthlyContributions: [
				{
					"points": 10,
					"description": "Fixed an issue with DELETE sending payload",
					"osProjectRef": "57bc79e3b6a4d67111f6270b",
					"contributorRef": "57be04cbde5451d4b88e4cf1",
					"_id": "57c056bf244e90090e7e5420"
				},
				{
					"points": 5,
					"description": "Fixed an issue with DELETE sending payload",
					"osProjectRef": "sapougsadgsadoigaspi",
					"contributorRef": "57be04cbde5451d4b88e4cf1",
					"_id": "57c056bf244e90090e7e5420"
				}
			]
		},
		{
			monthlyContributions: [
				{
					"points": 10,
					"description": "Fixed an issue with DELETE sending payload",
					"osProjectRef": "aihfaipsfsipg",
					"contributorRef": "57be04cbde5451d4b88e4cf1",
					"_id": "57c056bf244e90090e7e5420"
				},
				{
					"points": 5,
					"description": "Fixed an issue with DELETE sending payload",
					"osProjectRef": "57bc79e3b6a4d67111f6270b",
					"contributorRef": "57be04cbde5451d4b88e4cf1",
					"_id": "57c056bf244e90090e7e5420"
				}
			]
		}
	]);

	let points = list.getPointTotalForOSProject("57bc79e3b6a4d67111f6270b");

	QUnit.equal(points, 15);

});

QUnit.test("getTotalDollarsPerPointForOSProject", function(assert){

	let done = assert.async();
	ContributionMonth.getList({}).then(function(list) {

		let monthlyOSProject = list[0].monthlyOSProjects[0];

		let rate = list.getTotalDollarsPerPointForOSProject(monthlyOSProject);

		QUnit.equal(rate, 3.5);

		done();
	});

});

QUnit.test('.getTotalForAllPayoutsForContributor', assert => {
	const amounts = [ 87.5, 70 ];

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
	const amounts = [ 87.50, 70 ];

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
	const amounts = [ [ 0.25, 0.75 ], [ 0.20, 0.60, 0.20 ] ];

	let done = assert.async();
	ContributionMonth.getList({}).then(function(contributionMonths) {
		contributionMonths.forEach((contributionMonth, index) => {
			let monthlyOSProject = contributionMonth.monthlyOSProjects[0];

			let contributor1 = contributionMonth.monthlyContributors[0];
			let contributor2 = contributionMonth.monthlyContributors[1];
			let contributor3 = contributionMonth.monthlyContributors[2];

			let firstPercent = contributor1 && contributionMonths.getOwnershipPercentageForContributor(monthlyOSProject, contributor1, contributionMonth);
			let secondPercent = contributor2 && contributionMonths.getOwnershipPercentageForContributor(monthlyOSProject, contributor2, contributionMonth);
			let thirdPercent = contributor3 && contributionMonths.getOwnershipPercentageForContributor(monthlyOSProject, contributor3, contributionMonth);

			QUnit.equal(firstPercent, amounts[index][0], 'Percent owned is ' + amounts[index][0]);
			QUnit.equal(secondPercent, amounts[index][1], 'Percent owned is ' + amounts[index][1]);
			QUnit.equal(thirdPercent, amounts[index][2], 'Percent owned is ' + amounts[index][2]);
		});

		done();
	}, function(err) {
		QUnit.ok(false, err);
	});
});
