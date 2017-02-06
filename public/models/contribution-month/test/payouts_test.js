import QUnit from 'steal-qunit';
import OSProject from '~/models/os-project';
import ClientProject from '~/models/client-project';
import Contributor from '~/models/contributor';
import ContributionMonth from '~/models/contribution-month/';
import '~/models/fixtures/fixtures-socket';

QUnit.module('models ContributionMonth.List.getTotalForAllPayoutsForContributor');

QUnit.test('works', assert => {
	ContributionMonth.getList({ }).then(contributionMonths => {
		contributionMonths.getTotalForAllPayoutsForContributor();
	});

	assert.ok(true);
});
