import QUnit from 'steal-qunit';
import ContributionMonth from './contribution-month';

QUnit.module('models/contribution-month');

QUnit.test('getList', function(){
  stop();
  ContributionMonth.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.item(0).description, 'First item');
    start();
  });
});
