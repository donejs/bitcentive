import stache from 'can-stache';

stache.registerHelper('formatPercentAmount', function(value) {
	return  (value * 100) + '%';
});
