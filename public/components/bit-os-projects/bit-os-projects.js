import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './bit-os-projects.less';
import template from './bit-os-projects.stache';
import OSProjectModel from '../../models/os-project';
import ContributionMonthModel from '../../models/contribution-month';
import ContributionMonthModelFixture from '../../models/fixtures/contribution-month';

// console.log(ContributionMonthModelFixture.findAll({url: "/api/contribution_months", dataType: "json"}, function() {
//   console.log(arguments);
// }));

export const ViewModel = DefineMap.extend({
    contributionMonth: ContributionMonthModel
});


export default Component.extend({
  tag: 'bit-os-projects',
  ViewModel: ViewModel,
  template: template
});
