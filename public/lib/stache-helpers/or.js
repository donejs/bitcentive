import stache from 'can-stache';

stache.registerHelper('or', function() {
	return [...arguments].reduce((sum, operand) => {
		return !!sum || !!operand;
	});
});
