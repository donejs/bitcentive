'use strict';

const app = require('../src/app');
const denodeify = require('denodeify');

exports.up = function(db) {
	const svc = app.service('/api/contribution_months');
	const ContributionMonth = svc.Model;
	const paths = ContributionMonth.schema.paths;
	const update = denodeify(ContributionMonth.update.bind(ContributionMonth));

	/**
	 * Example update direct to db
	 */
	return update({
		startRate: { '$exists': false }
	}, {
		startRate: paths.startRate.defaultValue,
		endRate: paths.endRate.defaultValue
	});

	/**
	 * Example update using feathers services
	 */
	// return svc.find({ 
	// 	startRate: { '$exists': false } 
	// }).then(results => {
	// 	const stack = [];
	// 	results.forEach(item => {
	// 		item.startRate = paths.startRate.defaultValue;
	// 		item.endRate = paths.endRate.defaultValue;
	// 		stack.push(svc.update(item._id, item));
	// 	});
	// 	return Promise.all(stack);
	// });
};

exports.down = function(db) {
	const svc = app.service('/api/contribution_months');
	const ContributionMonth = svc.Model;
	const paths = ContributionMonth.schema.paths;
	const update = denodeify(ContributionMonth.update.bind(ContributionMonth));

	return update({}, {
		'$unset': { startRate: 1, endRate: 1 }
	});
};
