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
	ContributionMonth.getList({}).then(contributionMonths => {
		contributionMonths.getTotalForAllPayoutsForContributor();
	});

	assert.ok(true);
});

QUnit.test('.getOSProjectPayoutTotal', function(assert) {
	let done = assert.async();
	ContributionMonth.getList({}).then(function(contributionMonths) {
		let contributionMonth = contributionMonths[0];
		let monthlyOSProject = contributionMonth.monthlyOSProjects[0];
		let contributor = contributionMonth.monthlyContributions[0];

		let totalPayout = contributionMonths.getOSProjectPayoutTotal(monthlyOSProject, contributor, contributionMonth);

		QUnit.equal(totalPayout, 350, 'Total payout is correct');


		done();
	}, function(err) {
		QUnit.ok(false, err);
	});
});

QUnit.test('.getOwnershipPercentageForContributor', function(assert) {
	let done = assert.async();
	ContributionMonth.getList({}).then(function(contributionMonths) {
		let contributionMonth = contributionMonths[0];
		let monthlyOSProject = contributionMonth.monthlyOSProjects[0];
		let contributor = contributionMonth.monthlyContributions[0];

		let totalPayout = contributionMonths.getOSProjectPayoutTotal(monthlyOSProject, contributor, contributionMonth);

		QUnit.equal(totalPayout, 350, 'Total payout is correct');


		done();
	}, function(err) {
		QUnit.ok(false, err);
	});
});
