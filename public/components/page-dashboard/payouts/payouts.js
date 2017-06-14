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
  payoutFor(contributorRef, osProjectRef) {
    if (!this.payouts) {
      return {
        total: 0,
        percent: 0,
      };
    }

    if (contributorRef === null) {
        let result = {
          total: 0,
          percent: 0,
        };

        for (let contributorId in this.payouts) {
          let current = this.payouts[contributorId].monthlyOSProjects[osProjectRef._id];
          result.total += current.total;
          result.percent += current.percent;
        }

        return result;
    }

    if (!this.payouts[contributorRef._id] || !this.payouts[contributorRef._id].monthlyOSProjects[osProjectRef._id]) {
      return {
        total: 0,
        percent: 0,
      };
    }

    return this.payouts[contributorRef._id].monthlyOSProjects[osProjectRef._id];
  },

  // Stateful properties
  get otherContributors() {
    return Contributor.getList().then(contributors => {
      return contributors.filter(contributor => {
        return contributor.active && !this.contributionMonth.contributorsMap[contributor._id];
      });
    });
  },

  adding: {
    type: 'boolean',
    value: false
  },
  newContributorName: 'string',
  newContributorEmail: 'string',
  newContributorActive: 'boolean',
  newContributorError: 'string',
  selectedContributorId: {
    type: 'string',
    value: null
  },

  // Derived properties
  creatingNewContributor: {
    get: function() {
      return this.selectedContributorId === null;
    }
  },

  // Methods
  toggleAddNewContributor: function() {
    this.newContributorError = '';
    this.newContributorName = '';
    this.newContributorEmail = '';
    this.newContributorActive = true;
    this.adding = !this.adding;
  },
  addNewContributor: function(ev) {
    if (ev) {
      ev.preventDefault();
    }
    if (this.selectedContributorId === null) {
      return new Contributor({
        name: this.newContributorName,
        email: this.newContributorEmail,
        active: this.newContributorActive,
      }).save().then((contributor) => {
        this.contributionMonth.addNewMonthlyContributor(contributor);
        this.toggleAddNewContributor();
      }, (e) => {
        this.newContributorError = e.message;
      });
    } else {
      return this.otherContributors.then((contributors) => {
        contributors.each((contributor) => {
          if (this.selectedContributorId === contributor._id) {
            this.contributionMonth.addNewMonthlyContributor(contributor);
            this.toggleAddNewContributor();
          }
        });
      });
    }
  },
  removeContributor: function(ev, contributor) {
    return this.contributionMonth.removeMonthlyContributor(contributor);
  }
});

export default Component.extend({
  tag: 'bit-payouts',
  ViewModel: ViewModel,
  view
});
