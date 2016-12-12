"use strict";

/**
 * Creates a mock mongoose Query object. The callback is called with the results.
 * 
 * Allows for both query conventions:
 * 	- Model.find(params, callback)
 * 	- Model.find(params).exec(callback)
 * 	
 * This works for Model.find, Model.findOne, and Model.findById requests
 *
 * @param      {Object|Array}  The result which should be returned by the query
 * @return     {Mongoose.Query}  { A min }
 */
function createMockQueryObj(results) {
	var queryObj = {};
	['find', 'findOne'].forEach(method => {
		queryObj[method] = function(...args) {
			const lastArg = args[args.length - 1];
			// allows for Model.find(params, callback) signature
			if (typeof lastArg === 'function') {
				return lastArg(null, results);
			}

			// allows for Model.find(params).limit(n).exec(callback) signature
			['lean', 'distinct', 'sort', 'limit', 'select', 'where', 'equals', 'gt', 'gte', 'lt', 'lte', 'in'].forEach(method => {
				queryObj[method] = function() { return this; };
			});
			queryObj.exec = function(cb) { cb(null, results); };
			return this;
		};
	});
	return queryObj;
}

module.exports = {
	createMockQueryObj
};