'use strict';

const app = require('../src/app');

exports.up = function(db) {
	const svc = app.service('/api/contribution_months');
	const ContributionMonth = svc.Model;
	const paths = ContributionMonth.schema.paths;

	/**
	 * Example update direct to db
	 */
	return new Promise((resolve, reject) => {
		ContributionMonth.update({
			startRate: { '$exists': false }
		}, {
			startRate: paths.startRate.defaultValue,
			endRate: paths.endRate.defaultValue
		}, (err, result) => {
			if (err) return reject(err);
			return resolve(result);
		});
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

	return new Promise((resolve, reject) => {
		ContributionMonth.update({}, {
			'$unset': { startRate: 1, endRate: 1 }
		}, (err, result) => {
			if (err) return reject(err);
			return resolve(result);
		});
	});
};
