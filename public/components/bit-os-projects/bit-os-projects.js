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
    logIt: function(it) {
        console.log('logging');
        console.log(it);
    }
});


export default Component.extend({
  tag: 'bit-os-projects',
  ViewModel: ViewModel,
  template: template
});
