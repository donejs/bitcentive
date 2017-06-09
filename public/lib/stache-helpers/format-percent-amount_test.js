import QUnit from 'steal-qunit';
import stache from 'can-stache';

const formatPercentAmount = stache.getHelper('formatPercentAmount').fn;

QUnit.module('bitcentive/lib/stache-helpers/format-percent-amount');

QUnit.test('handles undefined', function() {
	QUnit.equal(formatPercentAmount(undefined), undefined, 'returns undefined');
});

QUnit.test('handles 0', function() {
	QUnit.equal(formatPercentAmount(0), '--', 'returns --');
});

QUnit.test('handles integers > 0', function() {
	QUnit.equal(formatPercentAmount(.25), '25%', 'returns 25%');
});

QUnit.test('handles floats > 0, rounding to nearest percent', function() {
	QUnit.equal(formatPercentAmount(.2356), '24%', 'returns 24%');
});
