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
    return ContributionMonth.getList({"date": {"$lte": this.contributionMonth.date}});
  },
  contributionMonths: {
    get: function(initial, resolve){
      this.contributionMonthsPromise.then(res => {
        return resolve(res);
      });
    }
  },
  getOSProjectPayoutTotal: function(monthlyOSProject, contributor) {
    var total = 0;
    if(this.contributionMonths) {
      var contributorsMap = this.contributionMonths.OSProjectContributionsMap;
      
      if(contributorsMap[monthlyOSProject.osProjectRef._id] && contributorsMap[monthlyOSProject.osProjectRef._id].contributors[contributor.contributorRef._id] ) {
        var contributorData = contributorsMap[monthlyOSProject.osProjectRef._id].contributors[contributor.contributorRef._id];
        var points = contributorData.points;
        var totalPoints = contributorsMap[monthlyOSProject.osProjectRef._id].totalPoints;
        var totalAmountForOSProject = this.contributionMonth.calculations.osProjects[monthlyOSProject.osProjectRef._id];

        total = (points / totalPoints) * totalAmountForOSProject;
      }
    }
    return total;
  },
  getTotalForAllPayoutsForContributor: function(contributorRef) {
    var total = 0;

    if(this.contributionMonths) {
      var contributorsMap = this.contributionMonths.OSProjectContributionsMap;  
      for(var osProjectID in contributorsMap) {
        var projectContributors = contributorsMap[osProjectID].contributors;

        
        if(projectContributors[contributorRef._id]) {
          var contributorData = contributorsMap[osProjectID].contributors[contributorRef._id];
          var points = contributorData.points;
          var totalPoints = contributorsMap[osProjectID].totalPoints;
          var totalAmountForOSProject = this.contributionMonth.calculations.osProjects[osProjectID];


          total = total + ( (points / totalPoints) * totalAmountForOSProject );
        }
      }
    }

    return total;
  },
  get payouts() {
    var map = {};
    if(this.contributionMonth) {
      
      var monthlyContributorsMap = this.contributionMonth.monthlyContributions.contributorsMap;
      var monthlyOSProjects = this.contributionMonth.monthlyOSProjects;

      for(var contributorID in monthlyContributorsMap) {

        var contributor = monthlyContributorsMap[contributorID];
        var contributorRef = contributor.contributorRef;
        
        if(!map[contributorRef._id]) {
          map[contributorRef._id] = {
            contributorRef: contributorRef,
            monthlyOSProjects: []
          };
        }

        monthlyOSProjects.forEach(monthlyOSProject => {
          var contributorTotal = this.getOSProjectPayoutTotal(monthlyOSProject, contributor);
          map[contributorRef._id].monthlyOSProjects.push({
            osProjectRef: monthlyOSProject.osProjectRef,
            total: contributorTotal
          });
        });        
      }
    }
    return map;
  },
  formatDollarAmount: function(value) {
    return value.toFixed(2);
  }
});

export default Component.extend({
  tag: 'bit-payouts',
  ViewModel: ViewModel,
  template
});
