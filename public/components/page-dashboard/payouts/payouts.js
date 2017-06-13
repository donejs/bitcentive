import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './payouts.stache';
import Contributor from '~/models/contributor';
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
		return this.contributionMonths &&
			this.contributionMonths.getMonthlyPayouts(this.contributionMonth);
  },
  /**
   * @property {Boolean} hasContributionPayouts
   *
   * Whether there are any payouts to display.
   */
  get hasContributionPayouts() {
    return this.payouts && Boolean(Object.keys(this.payouts).length);
  }
});

export default Component.extend({
  tag: 'bit-payouts',
  ViewModel: ViewModel,
  view
});
