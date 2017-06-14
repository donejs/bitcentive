'use strict';

const app = require('../src/app');
const denodeify = require('denodeify');

exports.up = function(db) {
	const service = app.service('/api/contribution_months');
	const ContributionMonth = service.Model;
	const update = denodeify(ContributionMonth.update.bind(ContributionMonth));

	return app.service('/api/contributors').find().then(contributors => {
		return service.find({
			monthlyContributors: { '$exists': false }
		}).then((results) => {
			const stack = [];

			for (let item of results) {
				item.monthlyContributors = contributors.map(contributor => {
					return {
						contributorRef: contributor._id,
					};
				});

				stack.push(service.update(item._id, item));
			}

			return Promise.all(stack);
		});
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
