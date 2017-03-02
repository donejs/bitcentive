"use strict";

const errors = require('feathers-errors');

/**
 * Only allows for creation of unique months.
 */
const handleCreateRequest = function (hook) {
	const ContributionMonth = this.Model;

	if (!hook.data.date) {
		return Promise.reject(new errors.BadRequest(`You must specify a date.`));
	}

	const postedDate = new Date(hook.data.date);
	const postedMonth = postedDate.getUTCMonth();
	const postedYear = postedDate.getUTCFullYear();
	const nextMonth = postedMonth === 11 ? 0 : postedMonth + 1;
	const nextYear = postedMonth === 11 ? 0 : postedYear + 1;
	// Lower limit - beginning of month (ex: 2018-12-01T00:00:00Z)
	const lowerLimit = new Date(Date.UTC(postedYear, postedMonth, 1));
	// Upper limit - beginning of next month (ex: 2019-01-01T00:00:00Z)
	const upperLimit = new Date(Date.UTC(nextMonth, nextYear, 1));

	return new Promise((resolve, reject) => {
		ContributionMonth.find({
			"date": {
				"$gte": lowerLimit,
				"$lt": upperLimit
			}
		}).limit(1).exec((err, results) => {
			if (err) {
				return reject(err);
			}
			if (results.length) {
				return reject(new errors.BadRequest(`Duplicate month - you cannot create two contribution months for the same month/year.`));
			}
			resolve(hook);
		});
	});
};

/**
 * This hook is intended to be use on the "before" phase
 * of any request to validate things.
 */
module.exports = function (options) {
	return function (hook) {
		let result;
		switch (hook.method) {
			case 'create':
				result = handleCreateRequest.call(this, hook);
				break;

			default:
				result = Promise.resolve(hook);
				break;
		}
		return result;
	};
};
