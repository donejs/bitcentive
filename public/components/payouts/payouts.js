import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './payouts.less';
import template from './payouts.stache';
import ContributionMonth from 'bitcentive/models/contribution-month/';

export const ViewModel = DefineMap.extend({
  // Passed properties
  contributionMonth: {
    Type: ContributionMonth
  },
  get contributionMonthsPromise() {
    return ContributionMonth.getList({});
  },
  contributionMonths: {
    get: function(initial, resolve){
      this.contributionMonthsPromise.then(resolve);
    }
  },
  getOSProjectPayoutTotal: function(monthlyOSProject, contributor) {
    if(this.contributionMonths) {
      var contributorsMap = this.contributionMonths.OSProjectContributionsMap;
      
      if(contributorsMap[monthlyOSProject.osProjectRef._id] && contributorsMap[monthlyOSProject.osProjectRef._id].contributors[contributor.contributorRef._id] ) {
        var contributorData = contributorsMap[monthlyOSProject.osProjectRef._id].contributors[contributor.contributorRef._id];
        var points = contributorData.points;
        var totalPoints = contributorsMap[monthlyOSProject.osProjectRef._id].totalPoints;
        var totalAmountForOSProject = this.contributionMonth.calculations.osProjects[monthlyOSProject.osProjectRef._id];

        return (points / totalPoints) * totalAmountForOSProject;
      }
    }
    return 0;
  }
});

export default Component.extend({
  tag: 'bit-payouts',
  ViewModel: ViewModel,
  template
});
