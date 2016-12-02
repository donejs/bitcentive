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
  getOSProjectTotal: function(osProject, calcMap) {
    var a = this.contributionMonths.reportMap;
    if(calcMap[osProject._id]) {
      return calcMap[osProject._id].totalPoints;
    }
    return 0;
  },
  get stats() {
    var map = {
      osProjects: {},
      contributors: {}
    };

    if(this.contributionMonths) {
      var contributionMonthsReportMap = this.contributionMonths.reportMap;
      var contributionMonthCalc = this.contributionMonth.calculations;
      
      this.contributionMonth.monthlyOSProjects.forEach((osProject) => {
        if(!map.osProjects[osProject.osProjectRef._id]) {
          //let's add this new osProject to the osProjectsMap
          map.osProjects[osProject.osProjectRef._id] = [];
        }
        
        map.osProjects[osProject.osProjectRef._id] = osProject.osProjectRef.value;
      });

      this.contributionMonth.monthlyContributions.forEach(contribution => {
        let contributorKey = contribution.contributorRef._id;
        
        if(!map.contributors[contributorKey]) {
          map.contributors[contributorKey] = {
            contributorRef: contribution.contributorRef,
            //totalContributionPoints: contribution.points,
            osProjects: {},
            totalPayout: 0
          };
        }
        else {
          //map.contributors[contributorKey].totalContributionPoints = map.contributors[contributorKey].totalContributionPoints + contribution.points;
        }

        if(!map.contributors[contributorKey].osProjects[contribution.osProjectRef._id]) {
          map.contributors[contributorKey].osProjects[contribution.osProjectRef._id] = {
            osProjectRef: contribution.osProjectRef,
            totalPoints: contribution.points
          };

          map.contributors[contributorKey].totalPayout = map.contributors[contributorKey].totalPayout + contribution.points; 
        } else {
          map.contributors[contributorKey].osProjects[contribution.osProjectRef._id].totalPoints = map.contributors[contributorKey].osProjects[contribution.osProjectRef._id].totalPoints + contribution.points; 
          map.contributors[contributorKey].totalPayout = map.contributors[contributorKey].totalPayout + contribution.points;
        }
      }); 
    }
    
    return map;
  },
  d: function() {
    console.log(arguments);
  }
});

export default Component.extend({
  tag: 'bit-payouts',
  ViewModel: ViewModel,
  template
});
