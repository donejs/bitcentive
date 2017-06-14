'use strict';

const app = require('../src/app');
const denodeify = require('denodeify');

exports.up = function(db) {
	const service = app.service('/api/contribution_months');
	const ContributionMonth = service.Model;
	const update = denodeify(ContributionMonth.update.bind(ContributionMonth));

	return service.find({
		monthlyContributors: { '$exists': false }
	}).then((results) => {
		const stack = [];

		for (let item of results) {
			let monthlyContributors = {};
			for (let { contributorRef } of item.monthlyContributions) {
				monthlyContributors[contributorRef] = true;
			}

			item.monthlyContributors = Object.keys(monthlyContributors)
				.map(contributorRef => ({ contributorRef }));

			stack.push(service.update(item._id, item));
		}

		return Promise.all(stack);
	});
};

exports.down = function(db) {
	const service = app.service('/api/contribution_months');
	const ContributionMonth = service.Model;
	const update = denodeify(ContributionMonth.update.bind(ContributionMonth));

	return update({}, {
		'$unset': { monthlyContributors: 1 }
	});
};
