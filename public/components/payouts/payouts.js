import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './payouts.less';
import view from './payouts.stache';
import ContributionMonth from 'bitcentive/models/contribution-month/';
import moment from "moment";

export const ViewModel = DefineMap.extend({
  // Passed properties
  contributionMonth: {
    Type: ContributionMonth
  },
  get contributionMonthsPromise() {
    return ContributionMonth.getList({});
  },
  contributionMonths: {
    get(initial, resolve){
      this.contributionMonthsPromise.then(resolve);
    }
  },
  getOSProjectPayoutTotal(monthlyOSProject, contributor) {
    let total = 0;
    if(this.contributionMonths) {
      const contributorsMap = this.contributionMonths.OSProjectContributionsMap(this.contributionMonth);

      if(contributorsMap[monthlyOSProject.osProjectRef._id] && contributorsMap[monthlyOSProject.osProjectRef._id].contributors[contributor.contributorRef._id] ) {
        const contributorData = contributorsMap[monthlyOSProject.osProjectRef._id].contributors[contributor.contributorRef._id];
        const points = contributorData.points;
        const totalPoints = contributorsMap[monthlyOSProject.osProjectRef._id].totalPoints;
        const totalAmountForOSProject = this.contributionMonth.calculations.osProjects[monthlyOSProject.osProjectRef._id];

        total = (points / totalPoints) * totalAmountForOSProject;
      }
    }
    return total;
  },
  getTotalForAllPayoutsForContributor(contributorRef) {
    let total = 0;

    if(this.contributionMonths) {
      const contributorsMap = this.contributionMonths.OSProjectContributionsMap(this.contributionMonth);
      for (const osProjectID in contributorsMap) {
        const projectContributors = contributorsMap[osProjectID].contributors;


        if(projectContributors[contributorRef._id]) {
          const contributorData = contributorsMap[osProjectID].contributors[contributorRef._id];
          const points = contributorData.points;
          const totalPoints = contributorsMap[osProjectID].totalPoints;
          const totalAmountForOSProject = this.contributionMonth.calculations.osProjects[osProjectID];


          total = total + ( (points / totalPoints) * totalAmountForOSProject );
        }
      }
    }

    return total;
  },
  get payouts() {
    const map = {};
    if(this.contributionMonth) {

      const monthlyContributorsMap = this.contributionMonth.monthlyContributions.contributorsMap;
      const monthlyOSProjects = this.contributionMonth.monthlyOSProjects;

      for (const contributorID in monthlyContributorsMap) {

        const contributor = monthlyContributorsMap[contributorID];
        const contributorRef = contributor.contributorRef;

        if(!map[contributorRef._id]) {
          map[contributorRef._id] = {
            contributorRef: contributorRef,
            monthlyOSProjects: []
          };
        }

        monthlyOSProjects.forEach(monthlyOSProject => {
          const contributorTotal = this.getOSProjectPayoutTotal(monthlyOSProject, contributor);
          map[contributorRef._id].monthlyOSProjects.push({
            osProjectRef: monthlyOSProject.osProjectRef,
            total: contributorTotal
          });
        });
      }
    }
    return map;
  },
  formatDollarAmount(value) {
    return value.toFixed(2);
  }
});

export default Component.extend({
  tag: 'bit-payouts',
  ViewModel: ViewModel,
  view
});
