import QUnit from 'steal-qunit';
import OSProject from '../../os-project';
import MonthlyOSProject from '../monthly-os-project';

QUnit.module('models/monthly-os-project');

QUnit.test('MonthlyOSProject basic test', function() {
  let osProject = new OSProject({
    _id: 'qwe123',
    name: 'DoneJS'
  });

  let monthlyOSProject = new MonthlyOSProject({
    significance: 0,
    commissioned: false,
    osProjectRef: osProject
  });

  ok(monthlyOSProject.osProjectRef._id === "qwe123",
    "osProjectRef _id is correct");
  ok(monthlyOSProject.osProjectRef._value.name === "DoneJS",
    "osProjectRef name is correct");
});

QUnit.test('MonthlyOSProject List basic test', function() {
  let osProject01 = new OSProject({
    _id: '1',
    name: 'DoneJS'
  });

  let osProject02 = new OSProject({
    _id: '2',
    name: 'CanJS'
  });

  let monthlyOSProject01 = new MonthlyOSProject({
    significance: 1,
    commissioned: true,
    osProjectRef: osProject01
  });

  let monthlyOSProject02 = new MonthlyOSProject({
    significance: 0,
    commissioned: false,
    osProjectRef: osProject02
  });

  let monthlyOSProjectsList = new MonthlyOSProject.List();
  monthlyOSProjectsList.push(monthlyOSProject01);
  monthlyOSProjectsList.push(monthlyOSProject02);

  ok(monthlyOSProjectsList.has(osProject01), "has works as expected");
  ok(monthlyOSProjectsList.getSignificance(osProject01) === 1,
    "getSignificance works as expected");
  ok(monthlyOSProjectsList.commissioned.length === 1,
    "got the right amount of commissioned")
});
