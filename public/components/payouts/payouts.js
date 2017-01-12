import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './payouts.stache';
import ContributionMonth from 'bitcentive/models/contribution-month/';
import moment from "moment";

export const ViewModel = DefineMap.extend({
  // Passed properties
  contributionMonth: ContributionMonth,
  /**
   * @property {Moment} currentMonth
   *
   * The current contribution month.
   */
  get currentMonth() {
    return this.contributionMonth && moment(this.contributionMonth.date);
  },
  contributionMonthsPromise: {
		value() {
			return ContributionMonth.getList({});
		}
  },
  contributionMonths: {
    get(initial, resolve){
      this.contributionMonthsPromise.then(resolve);
    }
  },
  /**
   * @property {List} effectiveMonths
   *
   * A list of contribution months including the current month and before.
   */
  get effectiveMonths() {
    return this.contributionMonths &&
      this.contributionMonths.filter(contributionMonth => {
        return this.currentMonth.isSameOrAfter(contributionMonth.date);
      });
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
  /**
   * @property {Map} monthlyOSProjects
   *
   * A unique set of OS Projects from the current and previous months.
   */
  get monthlyOSProjects() {
    let uniqueProjects = {};

    this.effectiveMonths && this.effectiveMonths.map(contributionMonth => {
      contributionMonth.monthlyOSProjects.map(monthlyOSProject => {
        uniqueProjects[monthlyOSProject._id] = monthlyOSProject;
      });
    });

    return uniqueProjects;
  },
  /**
   * @property {Map} payouts
   *
   * A map of OS Project payouts per Contributor based on the current month and
   * any previous months.
   *
   * e.g.
   * ```
   * {
   *   "5873af58cd85b95c3f6285f5": {
   *     "contributorRef": ...,
   *     "monthlyOSProjects": [
   *       {
   *         "osProjectRef": ...,
   *         "total": 0
   *       },
   *       {
   *         "osProjectRef": ...,
   *         "total": 339.9396969696969
   *       },
   *       {
   *         "osProjectRef": ...,
   *         "total": 0
   *       }
   *     ]
   *   }
   * }
   * ```
   */
  get payouts() {
    let contributorProjectPayouts = {};

    if (this.contributionMonth && this.contributionMonths) {
      let uniqueContributors = {};

      this.effectiveMonths.map(contributionMonth => {
        Object.assign(uniqueContributors,
          contributionMonth.monthlyContributions.contributorsMap);
      });

      Object.keys(uniqueContributors).map(contributorId => {
        let contributor = Object.assign({ }, uniqueContributors[contributorId]);
        contributor.monthlyOSProjects = [];

        Object.keys(this.monthlyOSProjects).map(projectId => {
          let monthlyOSProject = this.monthlyOSProjects[projectId];

          contributor.monthlyOSProjects.push({
            osProjectRef: monthlyOSProject.osProjectRef,
            total: this.getOSProjectPayoutTotal(monthlyOSProject, contributor)
          });
        });

        contributorProjectPayouts[contributorId] = contributor;
      });
    }

    return contributorProjectPayouts;
  },
	/**
	 * @property {Boolean} hasContributionPayouts
	 *
	 * Whethere there are any payouts to display.
	 */
  get hasContributionPayouts() {
    return Boolean(Object.keys(this.payouts).length);
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
