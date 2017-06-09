import stache from 'can-stache';

stache.registerHelper('formatPercentAmount', function(value) {
	if (value === undefined) {
		return value;
	}

	if (value === 0) {
		return '--';
	}

	return (value * 100).toFixed() + '%';
});
