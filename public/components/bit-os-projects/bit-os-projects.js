import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './bit-os-projects.less';
import template from './bit-os-projects.stache';
import OSProjectModel from '../../models/os-project';
import ContributionMonthModel from '../../models/contribution-month';

export const ViewModel = DefineMap.extend({
    contributionMonth: {
        Value: ContributionMonthModel
    },
    contributionMonthPromise: {},
    logIt: function(it) {
        console.log('logging');
        console.log(it);
    },
    toggle: function(monthlyOSProject) {
      console.log("toggle");
      monthlyOSProject.commissioned = !monthlyOSProject.commissioned;
      this.contributionMonth[0].save();
    }
});


export default Component.extend({
  tag: 'bit-os-projects',
  ViewModel: ViewModel,
  template: template
});
