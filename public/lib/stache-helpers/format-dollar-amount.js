import stache from 'can-stache';

stache.registerHelper('formatDollarAmount', function(value) {
	return value.toFixed(2);
});
