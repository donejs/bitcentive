import stache from 'can-stache';

stache.registerConverter("emptyToNull", {
	get: function(compute) {
		let value = compute();
		return value === null ? "" : value;
	},
	set: function(newVal, compute) {
		compute( newVal === "" ? null : newVal);
	}
});
