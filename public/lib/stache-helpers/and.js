import stache from 'can-stache';

stache.registerHelper('and', function() {
	return [...arguments].reduce((sum, operand) => {
		return !!sum && !!operand;
	});
});
