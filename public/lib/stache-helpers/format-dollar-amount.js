import stache from 'can-stache';

stache.registerHelper('formatDollarAmount', function(value) {
	if (value === undefined) {
		return value;
	}

	if (value === 0) {
		return '--';
	}

	return '$' + value.toFixed(2);
});
