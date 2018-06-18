import QUnit from 'steal-qunit';
import stache from 'can-stache';
import "./format-dollar-amount";

const formatDollarAmount = stache.getHelper('formatDollarAmount');

QUnit.module('bitcentive/lib/stache-helpers/format-dollar-amount');

QUnit.test('handles undefined', function(assert) {
	QUnit.equal(formatDollarAmount(undefined), undefined, 'returns undefined');
});

QUnit.test('handles 0', function(assert) {
	QUnit.equal(formatDollarAmount(0), '--', 'returns --');
});

QUnit.test('handles integers > 0', function(assert) {
	QUnit.equal(formatDollarAmount(1), '$1.00', 'returns $1.00');
});

QUnit.test('handles floats > 0', function(assert) {
	QUnit.equal(formatDollarAmount(123.456), '$123.46', 'returns $123.46');
});
